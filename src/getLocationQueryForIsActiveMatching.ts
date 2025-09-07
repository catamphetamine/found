import {
  parseInputLocation,
  type InputLocationObject,
} from 'navigation-stack';

export default function getLocationQueryForIsActiveMatching(
  location: InputLocationObject,
) {
  try {
    return parseInputLocation(location).query;
  } catch (error) {
    return;
  }
}
