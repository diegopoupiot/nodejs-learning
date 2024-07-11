function success (result) {
    return {
        status: 'success',
        result: result
    }
}

function error (message) {
    return {
        status: 'error',
        message: message
    }
}

function checkAndChange(obj) {
    if (!obj || obj instanceof Error) {
        return error(obj.message);
    } else {
        return success(obj);
    }
}

module.exports = {
    success,
    error,
    checkAndChange
}