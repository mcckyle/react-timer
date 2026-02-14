//File name: jest.config.js
//Author: Kyle McColgan
//Date: 12 February 2026
//Description: This file contains the Jest config for the Timer project Jest unit test suite.

export default {
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy",
    },
    testEnvironment: "jsdom",
};
