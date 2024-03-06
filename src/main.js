//- MARK: Environment

const CONFIG_DEBUG = import.meta.env.DEV;

const CONFIG_GITHUB_AUTH = '<REDACTED>';
const CONFIG_GITHUB_REPO = {
    owner: 'ktprograms',
    repo: 'STEP2024-Scratch-Cheatsheet-Usage',
};

const CONFIG_SCRATCHBLOCKS_OPTIONS = {
    style: 'scratch3',
    scale: 0.75,
};

const CONFIG_VALID_EMAIL = /^(?:[a-zA-Z0-9.])+@edu\.dignityforchildren\.org$/;
const CONFIG_UNPRIVILEGED_EMAIL = /^dc(?:24)?(?:[a-zA-Z0-9.])+@edu\.dignityforchildren\.org$/;

//- MARK: scratchblocks

import scratchblocks from 'scratchblocks';

function replace(el, svg, doc, options) {
    scratchblocks.replace(el, svg, doc, options);

    // Remove .scratchblocks{,--inline} parent element
    el.parentNode.replaceChild(el.firstElementChild, el);
}
const scratchblockOptions = {
    ...CONFIG_SCRATCHBLOCKS_OPTIONS,
    replace: replace,
};

function renderScratchblocks() {
    scratchblocks.renderMatching('pre.scratchblocks', scratchblockOptions);
    scratchblocks.renderMatching('code.scratchblocks--inline', {
        inline: true,
        ...scratchblockOptions,
    });
}
renderScratchblocks();

//- MARK: GitHub API

import { Octokit } from 'octokit';

const octokit = new Octokit({
    auth: CONFIG_GITHUB_AUTH,
});

/**
 * @param {string} user
 * @returns {number} Number of created issue
 */
async function createIssue(user) {
    const issue = await octokit
        .rest
        .issues
        .create({
            ...CONFIG_GITHUB_REPO,
            title: user,
            labels: [
                {
                    name: user,
                },
            ],
        });

    return issue.data.number;
}

/**
 * @param {string} user
 * @returns {number} Issue number for {@link user}
 */
async function getIssueNumber(user) {
    const response = await octokit
        .rest
        .issues
        .listForRepo({
            ...CONFIG_GITHUB_REPO,
            labels: user,
        });

    if (response.data.length > 0) {
        return response.data[0].number;
    } else {
        return await createIssue(user);
    }
}

/**
 * @param {string} user
 * @param {string} comment
 */
async function createComment(user, comment) {
    const issueNumber = await getIssueNumber(user);

    await octokit
        .rest
        .issues
        .createComment({
            ...CONFIG_GITHUB_REPO,
            issue_number: issueNumber,
            body: comment,
        });
}

/**
 * @param {string} user
 * @param {string} key
 */
async function logKeyShown(user, key) {
    if (CONFIG_DEBUG) {
        console.debug('SHOWN:', user, key);
    } else {
        await createComment(user, key);
    }
}

//- MARK: Content

document.querySelectorAll('.accordion-header').forEach(function (questionContainer) {
    const questionEl = questionContainer.querySelector('[data-show]');
    if (!questionEl) {
        return;
    }

    const key = questionEl.dataset.show;
    const question = document.querySelector(`.question-text__${key}`);
    if (!question) {
        return;
    }

    questionEl.parentNode.replaceChild(question, questionEl);
});

//- MARK: Users

function isEmailValid(email) {
    return CONFIG_VALID_EMAIL.test(email);
}
function isEmailUnprivileged(email) {
    return CONFIG_UNPRIVILEGED_EMAIL.test(email);
}

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

if (!isEmailValid(email)) {
    document.querySelector('.nav__signinout').outerHTML = '<button class="nav__signinout btn btn-primary" data-bs-target=".signin" data-bs-toggle="modal">Sign In</button>';
} else {
    if (isEmailUnprivileged(email)) {
        document.querySelector('.nav__signinout').outerHTML = `<a class="nav__signinout btn btn-outline-primary" data-bs-target=".signin" href="?">${email}</button>`;
    } else {
        document.querySelector('.nav__signinout').outerHTML = `<a class="nav__signinout btn btn-outline-success" data-bs-target=".signin" href="?">${email}</button>`;

        addEventListener('load', function () {
            document.querySelectorAll('.hint__show').forEach(function (hintEl) {
                hintEl.dispatchEvent(new Event('click', { bubbles: true }));
            });
        });

        document.querySelectorAll('.answer').forEach(function (answerContainer) {
            answerContainer.removeAttribute('hidden');

            const answerEl = answerContainer.querySelector('[data-show]');
            if (!answerEl) {
                return;
            }

            const key = answerEl.dataset.show;
            const answer = document.querySelector(`.answer-text__${key}`);
            if (!answer) {
                return;
            }

            answerEl.parentNode.replaceChild(answer, answerEl);
        });
    }
}

//- MARK: Event listeners

document.addEventListener('click', function (event) {
    if (!event.target.matches('.hint__show')) {
        return;
    }
    if (!isEmailValid(email)) {
        document.querySelector('.nav__signinout').click();
        return;
    }

    const key = event.target.dataset.show;
    const hint = document.querySelector(`.hint-text__${key}`);
    if (!hint) {
        return;
    }

    if (isEmailUnprivileged(email)) {
        logKeyShown(email, key);
    }

    event.target.parentNode.replaceChild(hint, event.target);
    renderScratchblocks();
});
