module.exports = {
    PromiseTimeout(delayms) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, delayms);
        });
    },
}