import React from "react";
import { Card, CardBody } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Products = (props) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${props.product._id}`}>
        <Card.Img src={props.product.image} variant="top" />
      </Link>
      <CardBody>
        <Link to={`/product/${props.product._id}`}>
          <Card.Title as="div">
            <strong>{props.product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            eva={props.names}
            value={props.product.rating}
            text={`${props.product.numReviews}reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">₹ {props.product.price}</Card.Text>
      </CardBody>
    </Card>
  );
};

export default Products;
