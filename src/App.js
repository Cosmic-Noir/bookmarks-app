import React, { Component } from "react";
import { Route } from "react-router-dom";
import AddBookmark from "./AddBookmark/AddBookmark";
import BookmarkList from "./BookmarkList/BookmarkList";
import Nav from "./Nav/Nav";
import BookmarksContext from "./BookmarksContext";
import EditBookmark from "./editForm/EditBookmark";
import config from "./config";
import "./App.css";

class App extends Component {
  state = {
    bookmarks: [],
    error: null
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null
    });
  };

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark]
    });
  };

  deleteBookmark = bookmarkId => {
    fetch(config.API_ENDPOINT, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }));
    // const newBookmarks = this.state.bookmarks.filter(
    //   bm => bm.id !== bookmarkId
    // );
    // this.setState({ newBookmarks });
    // console.log("DELETE is called");
  };

  updateBookmark = updatedBookmark => {
    fetch(config.API_ENDPOINT, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }));

    // console.log(updatedBookmark);
    // console.log(this.state.bookmarks);
    // this.setState({
    //   bookmarks: this.state.bookmarks.map(bookmark =>
    //     bookmark.id !== updatedBookmark.id ? bookmark : updatedBookmark
    //   )
    // });
    // console.log(this.state.bookmarks);
    // console.log("updateBookmark called");
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }));
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark
    };
    return (
      <main className="App">
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className="content" aria-live="polite">
            <Route path="/add-bookmark" component={AddBookmark} />
            <Route path="/edit/:bookmarkId" component={EditBookmark} />
            <Route exact path="/" component={BookmarkList} />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
