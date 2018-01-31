// @flow

import $ from 'jquery'
import React, { Component } from 'react'
import classNames from 'classnames'

type Image = {
  base64: string,
  imageId: number,
  rotation: ?number,
}

type Props = {
  lastImageId: number,
}

type State = {
  images: Array<Image>,
  lastImageId: number,
}

export default class ClassifyImagePanel extends Component<Props, State> {
  constructor(...args: Array<any>) {
    super(...args)

    this.state = {
      images: [],
      lastImageId: this.props.lastImageId || 0,
    }
  }

  componentDidMount() {
    this.fetchNextPage()
  }

  fetchNextPage() {
    let { lastImageId } = this.state
    $.get(`/images?last_image_id=${lastImageId}`).done((data) => {
      this.setState({
        images: data,
        lastImageId: data[data.length - 1].imageId,
      })
    })
  }

  setRotation(image: Image, rotation: number) {
    let { images } = this.state
    for (var _image of images) {
      if (_image.imageId == image.imageId) {
        _image.rotation = rotation
        break
      }
    }
    this.setState({ images: images })
  }

  render() {
    let { images } = this.state
    let _images = []
    for (var image of images) {
      let buttons = []
      for (var r of [0, 90, 180, 270]) {
        let className = classNames({
          'btn': true,
          'btn-default': true,
          'active': image.rotation == r,
        })
        buttons.push(
          <button className={className}
                  onClick={this.setRotation.bind(this, image, r)}>
            {r}
          </button>
        )
      }
      _images.push(
        <div className="image-list-item">
          <img src={`data:image/png;base64,${image.base64}`}></img>
          <div className="btn-group">
            {buttons}
          </div>
        </div>
      )
    }
    return (
      <div className="container">
        <div className="image-list">
          {_images}
        </div>
      </div>
    )
  }
}
