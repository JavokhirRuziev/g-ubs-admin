const fs = require('fs'); // модуль для работы с файловой системой
const path = require('path'); // модуль для преобразования пути
const minimist = require('minimist'); // модуль для преобразования строки аргументов в объект

const args = minimist(process.argv);

const srcPath = [__dirname, '..', 'src']; // путь до папки src текущего проекта
const arrPath = args.path.split('/'); // разбиваем путь из аргумента командной строки на массив
const componentName = arrPath[arrPath.length - 1]; // последний элемент - название компонента

// создание директорий из аргумента (при необходимости)
const currentArray = [];
arrPath.forEach(element => {
  currentArray.push(element);
  const currentResolvePath = path.resolve(...srcPath, ...currentArray);
  if (!fs.existsSync(currentResolvePath)) { // проверка - существует такая директория или нет?
    fs.mkdirSync(currentResolvePath); // если нет, то создаем новую
  }
});

const camelToSnake = string => {
  return string.replace(/[\w]([A-Z])/g, function(m) {
    return m[0] + "-" + m[1];
  }).toLowerCase();
};

const componentPath = [...srcPath, ...arrPath];

// создание компонента
const componentCode = `import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './style.scss';

const ${componentName} = ({name, className}) => {
  const classNames = cx(
    '${camelToSnake(componentName)}',
    className,
  );
  return (
    <div className={classNames}>{name}</div>
  );
};

${componentName}.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
};
${componentName}.defaultProps = {
    name: "OKS",
    className: ''
};

export default ${componentName};`;
fs.writeFileSync(path.resolve(...componentPath, `${componentName}.jsx`), componentCode);

// создание индексного файла
const indexCode = `export { default } from './${componentName}';`;
fs.writeFileSync(path.resolve(...componentPath, 'index.js'), indexCode);

// создание файла стилей
const styleCode = `.${camelToSnake(componentName)} {}`;
fs.writeFileSync(path.resolve(...componentPath, `style.scss`), styleCode);
