import { InputLocation } from 'navigation-stack';

// This isn't really an error.
export default class RedirectException {
  isFoundRedirectException = true;

  location: InputLocation;

  status: number;

  constructor(location: InputLocation, status = 302) {
    this.location = location;
    this.status = status;
  }
}
