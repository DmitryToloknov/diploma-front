import {BASE_ERROR, SERVER_URL} from "../../utils/constant.js";

export const createSkillApi = async (accessToken, name) => {
    try {
        const response = await fetch(`${SERVER_URL}skill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: name,
            })
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTestCaseApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}test-case/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data:  await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const updateTestCaseApi = async (accessToken, testCase) => {
    try {
        const response = await fetch(`${SERVER_URL}test-case`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(testCase)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const addTaskInCourseApi = async (accessToken, id, taskId) => {
    try {
        const response = await fetch(`${SERVER_URL}course/${id}/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};