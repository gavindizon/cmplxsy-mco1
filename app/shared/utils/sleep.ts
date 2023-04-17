function sleep(ms: number) {
    console.log("Test");
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default sleep;
