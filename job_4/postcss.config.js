module.exports = {
    plugins: {
        'postcss-preset-env': ({
            stage: 0, //阶段
            features: {
                'nesting-rules': true, //允许嵌套
            }
        })
    }
};