import yaml from 'js-yaml';

export const toYaml = (obj: any): string => {
  try {
    return yaml.dump(obj);
  } catch (e) {
    console.error('YAML Dump Error', e);
    return '';
  }
};

export const parseYaml = (str: string): any => {
  try {
    return yaml.load(str);
  } catch (e) {
    console.error('YAML Parse Error', e);
    return null;
  }
};
