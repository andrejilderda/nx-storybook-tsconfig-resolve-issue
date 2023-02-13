import { classNamePrefix } from 'lib/constants/styles';
import { processTemplateLiteralValues } from './helpers.css';

/**
 * Higher order function that returns a tagged template literal-function for
 * setting custom properties with a certain value.
 *
 * @example
 * const setVar = createSetVarFn(componentName);
 * ...
 * // single line
 * vars: {
 *   ...setVar`--font-size: 12px`,
 * }
 *
 * // multiple lines
 * vars: {
 *   ...setVar`
 *     --font-size: 12px,
 *     --border-width: 1px,
 *   `,
 * }
 */

export const createSetVarFn =
  (componentName: string) =>
  (strings: TemplateStringsArray, ...values: any[]) => {
    const processedString = processTemplateLiteralValues(strings, ...values);

    // split lines
    const lines = processedString?.trim().split(/\n/gm);

    return lines.reduce((acc, line) => {
      // remove var dashes (--) from beginning of var-name for further processing:
      // fe. '--foo--bar: 12px' › '['foo--bar', '12px']'
      const splitVariablesClean = line
        ?.trim()
        .replaceAll(/^--/g, '') // replace all dashes at the beginning of a string;
        .replaceAll(/,$/g, '') // replace all , at the end of a string;
        .split(/\:\s*/i);

      const [variableClean, value] = splitVariablesClean;

      return {
        ...acc,
        [namespaceVar(componentName, variableClean)]: value,
      };
    }, {});
  };

export const namespaceVar = (componentName: string, name: string) => {
  return `--${classNamePrefix}-${componentName}-${name.replace(/^--/g, '')}`;
};
