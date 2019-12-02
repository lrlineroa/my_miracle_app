class HandleInput {
    static onChangeText(context,value, field) {
        let userDataCopy = {}
        Object.assign(userDataCopy, context.state.userData);
        userDataCopy[field] = value;
        context.setState({
            userData: userDataCopy
        })
    }
}

export default HandleInput;