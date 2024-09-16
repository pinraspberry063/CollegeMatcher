module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': 0,
  },
  requireConfigFile: false,
  babelOptions: {
    presets: ["@babel/preset-react"],
}
};
