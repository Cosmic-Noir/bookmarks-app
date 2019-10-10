import React, { Component } from "react";
import BookmarksContext from "../BookmarksContext";
import PropTypes from "prop-types";
import config from "../config";

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: "",
    title: "",
    url: "",
    description: "",
    rating: 1
  };

  // Methods:
  handleSubmit = e => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating };
    console.log(config.API_ENDPOINT + `/${bookmarkId}`);
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));
      })
      .then(() => {
        console.log("Patch request sent, res 204");
        this.context.updateBookmark(newBookmark);
        this.resetFields(newBookmark);
        this.props.history.push("/");
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = newFields => {
    this.setState({
      id: newFields.id || "",
      title: newFields.title || "",
      url: newFields.url || "",
      description: newFields.description || "",
      rating: newFields.rating || ""
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value });
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value });
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value });
  };

  // Lifecycle methods
  componentDidMount() {
    const { bookmarkId } = this.props.match.params;

    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
        return res.json;
      })
      .then(res => {
        this.setState({
          id: res.id,
          title: res.title,
          url: res.url,
          description: res.description,
          rating: res.rating
        });
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  render() {
    const { title, url, description, rating } = this.state;
    return (
      <section className="EditBookmarkForm">
        <h2>Edit Bookmark</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" />
          <label htmlFor="title">Title </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={this.handleChangeTitle}
          />
          <label htmlFor="url">Url </label>
          <input
            type="url"
            name="url"
            id="url"
            required
            value={url}
            onChange={this.handleChangeUrl}
          />
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={this.handleChangeDescription}
          />
          <label htmlFor="rating">Rating </label>
          <input
            type="number"
            name="rating"
            id="rating"
            min="1"
            max="5"
            required
            value={rating}
            onChange={this.handleChangeRating}
          />
          <button type="button" onClick={this.handleClickCancel}>
            Cancel
          </button>
          <button type="submit">Update</button>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
