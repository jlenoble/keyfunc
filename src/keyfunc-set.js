import sig from 'sig';
import objectFunc from './keyfunc-object';
import removeDuplicates from './remove-duplicates';

export default function setFunc (elementKeyfunc = objectFunc()) {
  return array => {
    try {
      return sig(removeDuplicates(...array.map(arg => {
        return elementKeyfunc(arg);
      })).sort());
    } catch (e) {
      if (e.message.match(/array.map is not a function/)) {
        throw new TypeError(`Function can only generate keys for sets,
but argument was: ${JSON.stringify(array)}`);
      }
      throw e;
    }
  };
};
