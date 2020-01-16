import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';
import { Router } from 'react-router-dom';

class EditBookmark extends Component {

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
      const bookmarkId = this.props.match.params.bookmarkId;
      fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${config.API_KEY}`
          }
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(response => {
          this.setState({
              title: response.title,
              url: response.url,
              description: response.description,
              rating: response.rating,
          })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })

  }

  handleSubmit = e => {
    e.preventDefault()
    const bookmarkId = this.props.match.params.bookmarkId;
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
        method: 'PATCH',
        body: JSON.stringify(newBookmark),
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${config.API_KEY}`
        }
    })
    .then(res => {
      if (!res.ok) {
        return res.then(error => Promise.reject(error))
      }
      return res
    })
    .then(response => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(response)
        this.props.history.push('/')
    })
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  render() {
    const { error } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={this.state.title}
              onChange={(e) => this.setState({title: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={this.state.url}
              onChange={(e) => this.setState({url: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.description}
              onChange={(e) => this.setState({description: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              value={this.state.rating}
              onChange={(e) => this.setState({rating: e.target.value})}
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit' onClick={this.handleSubmit}>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
