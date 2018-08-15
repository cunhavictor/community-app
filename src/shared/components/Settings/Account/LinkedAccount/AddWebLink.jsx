/**
 * Renders 'Add a Web Link' section.
 */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import _ from 'lodash';
import PT from 'prop-types';

import './styles.scss';

export default class AddWebLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webLink: '',
    };

    this.onUpdateWebLink = this.onUpdateWebLink.bind(this);
    this.onAddWebLink = this.onAddWebLink.bind(this);
    this.isWebLinkValid = this.isWebLinkValid.bind(this);
    this.isWebLinkExist = this.isWebLinkExist.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { profileState } = this.props;
    if (profileState.addingWebLink && !nextProps.profileState.addingWebLink) {
      this.setState({ webLink: '' });
    }
  }

  // Set web link
  onUpdateWebLink(e) {
    e.preventDefault();
    this.setState({ webLink: e.target.value });
  }

  // Add web link
  onAddWebLink(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      const {
        addWebLink,
        handle,
        tokenV3,
      } = this.props;
      const { webLink } = this.state;
      if (webLink && this.isWebLinkValid() && !this.isWebLinkExist()) {
        addWebLink(handle, tokenV3, webLink);
      }
    }
  }

  isWebLinkValid() {
    const { webLink } = this.state;
    return !webLink || /^(http(s?):\/\/)?(www\.)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,15})+(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?$/.test(webLink); /* eslint-disable-line no-useless-escape */
  }

  isWebLinkExist() {
    const { webLink } = this.state;
    const {
      allLinks,
    } = this.props;
    return _.some(allLinks, link => link.URL.toLowerCase() === webLink.toLowerCase());
  }

  render() {
    const { webLink } = this.state;

    const webLinkValid = this.isWebLinkValid();
    const isWebLinkExist = this.isWebLinkExist();

    return (
      <div styleName="external-web-link">
        <div styleName="web-link">
          <form
            name="addWebLinkFrm"
            autoComplete="off"
            onSubmit={this.onAddWebLink}
          >
            <label htmlFor="external-link">
              External Link
            </label>
            <div styleName={webLinkValid ? 'validation-bar url' : 'validation-bar url error-bar'}>
              <input
                id="web-link-input"
                name="url"
                type="text"
                styleName="url"
                value={webLink}
                onChange={this.onUpdateWebLink}
                placeholder="http://www.yourlink.com"
                onKeyDown={this.onAddWebLink}
                required
              />
              {
                !webLinkValid && !isWebLinkExist
                && (
                  <div styleName="form-input-error">
                    <p>
Please enter a valid URL
                    </p>
                  </div>
                )
              }
              {
                isWebLinkExist
                && (
                  <div styleName="form-input-error">
                    <p>
                      {`The URL ${webLink} already exists`}
                    </p>
                  </div>
                )
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddWebLink.defaultProps = {
  allLinks: [],
};

AddWebLink.propTypes = {
  handle: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  profileState: PT.shape().isRequired,
  addWebLink: PT.func.isRequired,
  allLinks: PT.arrayOf(PT.shape),
};
