const hello = function() {
    return 'world'
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            hello: hello
        }
    }
})