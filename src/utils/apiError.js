class apiError extends Error{
    constructor(
        message,
        statusCode,
        error = [])
        {
            super(message)
                this.statusCode = statusCode,
                this.error = error,
                this.message = message,
                this.success = false,
                this.data = null
            
        }
}

export {apiError}

