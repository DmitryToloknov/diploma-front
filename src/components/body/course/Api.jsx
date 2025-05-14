import {BASE_ERROR, SERVER_URL} from "../../../utils/constant.js";

export const createCourseApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}course`, {
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
        return {success: true, data: await response.text()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getGroupsApi = async (accessToken) => {
    try {
        const response = await fetch(`${SERVER_URL}group/setting`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getCourseApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}course/${id}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const deleteCourseApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}course/${id}`, {
            method: 'DELETE',
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

export const updateCourseApi = async (accessToken, course) => {
    try {
        const response = await fetch(`${SERVER_URL}course`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(course)
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

export const getTasksApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}course/${id}/tasks`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const deleteTaskApi = async (accessToken, id, taskId) => {
    try {
        const response = await fetch(`${SERVER_URL}course/${id}/${taskId}`, {
            method: 'DELETE',
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

export const getTaskInfoApi = async (accessToken, id, courseId) => {
    try {
        const response = await fetch(`${SERVER_URL}task/${id}/${courseId}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const addAttemptApi = async (accessToken, taskId, courseId, attempt) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/${taskId}/${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(attempt)
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

export const getAttemptsApi = async (accessToken, taskId, courseId) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/${taskId}/${courseId}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getAttemptApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/${id}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTotalNumberApi = async (accessToken, filter) => {
    try {
        const response = await fetch(`${SERVER_URL}course/total-number`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(filter)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: parseInt(await response.text(), 10)};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getCoursesApi = async (accessToken, filter, page, perPage) => {
    try {
        const response = await fetch(`${SERVER_URL}course/page/${page}/${perPage}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(filter)
        });

        if (!response.ok) {
            const data = await response.text();
            return {success: false, error: data};
        }
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getInfoCourseApi = async (accessToken, id) => {
    try {
        const response = await fetch(`${SERVER_URL}course/info/${id}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTaskInfoForCourseApi = async (accessToken, courseId) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/course/${courseId}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getUsersByGroupIdApi = async (accessToken, groupId) => {
    try {
        const response = await fetch(`${SERVER_URL}user/group/${groupId}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getTaskInfoForStatisticsApi = async (accessToken, courseId, userId) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/course/${courseId}/${userId}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const getHistoryForStatisticsApi = async (accessToken, taskId, courseId, userId) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/${taskId}/${courseId}/${userId}`, {
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
        return {success: true, data: await response.json()};
    } catch (error) {
        return {
            success: false,
            error: BASE_ERROR
        };
    }
};

export const RejectAttemptApi = async (accessToken, id, reasonAttempt) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/${id}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(reasonAttempt)
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

export const ReasonApproveApi = async (accessToken, id, reasonApprove) => {
    try {
        const response = await fetch(`${SERVER_URL}attempt/${id}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(reasonApprove)
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