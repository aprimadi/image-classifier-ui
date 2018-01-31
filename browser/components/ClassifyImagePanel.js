// @flow

import _ from 'lodash'
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
      }, () => {
        $(window).scrollTop(0)
      })
    })
  }

  submit() {
    let { images } = this.state
    let count = 0
    for (var image of images) {
      $.post('/images/update', {
        image_id: image.imageId,
        rotation: image.rotation || 0,
      }).done((data) => {
        count++
        if (count == images.length) {
          this.fetchNextPage()
        }
      })
    }
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
      let imgClassName = classNames({
        "rotate90": image.rotation == 270,
        "rotate180": image.rotation == 180,
        "rotate270": image.rotation == 90,
      })
      _images.push(
        <div className="image-list-item">
          <img src={`data:image/png;base64,${image.base64}`}></img>
          <img className={imgClassName} src={`data:image/png;base64,${image.base64}`}></img>
          <div className="pull-right">
            <div className="btn-group">
              {buttons}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div className="container">
          <div className="image-list">
            {_images}
          </div>
        </div>
        <div className="panel-menu">
          <div className="container">
            <button className="btn btn-primary" onClick={this.submit.bind(this)}>Next</button>
          </div>
        </div>
      </div>
    )
  }
}
