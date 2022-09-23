const {REACT_APP_API_ROOT} = process.env;

const config = {
  EXPENSE_CATEGORY_TYPE: 1,
  INCOME_CATEGORY_TYPE: 2,
  SOLVED_CATEGORY_TYPE: 3,

  CUSTOMER_TYPE_CLIENT: 1,
  CUSTOMER_TYPE_EMPLOYEE: 2,
  CUSTOMER_TYPE_COUNTER_AGENT: 3,

  API_ROOT: REACT_APP_API_ROOT,
  DEFAULT_LANGUAGE: 'ru',
  API_LANGUAGES: [
    {id: 1, code: 'ru', title: 'Русский'},
    {id: 2, code: 'uz', title: 'Узбекский'},
    {id: 3, code: 'en', title: 'Английский'},
  ]

};

export default config;