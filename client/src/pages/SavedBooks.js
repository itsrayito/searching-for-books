import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations"
import { removeBookId } from "../utils/localStorage";

import Auth from "../utils/auth";

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

// this will create a function that accepts the book's mongo _id value as param and deletes the book from the db
const handleDeleteBook = async (bookId) => {

  // this gets token
  const token = Auth.loggedIn()? Auth.getToken() : null;

  if (!token) {
    return false;
  }

  try {
    const { data } = await removeBook({
      variables: { bookId },
    });

    // this will remove the book id from the localstorage
    removeBookId(bookId);
  } catch (err) {
    console.error(err);
  }
};

if (loading) {
  return <h2>Loading!</h2>;
}

return (
  <>
  <Jumbotron fluid className="text-light bg-dark">
    <Container>
      <h1>Viewing {userData.username}'s books!</h1>
    </Container>
  </Jumbotron>
  <Container>
    <h2>
      {userData.savedBooks?.length
      ? `Viewing ${userData.savedBooks.length} saved ${
        userData.savedBooks.length === 1 ? "book" : "books"
      }:`
      : "You have no saved books."}
    </h2>
    <CardColumns>
      {userData.savedBooks?.map((book) => {
        return (
          <Card key={book.bookId} border="dark">
            {book.image ? (
              <Card.Img
              src={book.image}
              alt={`The cover for ${book.title}`}
              variant="top"
              />
            ) : null}
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <p className="small">Authors: {book.authors}</p>
              <Card.Text>{book.description}</Card.Text>
              <Button
              className="btn-block btn-danger"
              onClick={() => handleDeleteBook(book.bookId)}
              >
                Delete this book!
              </Button>
            </Card.Body>
          </Card>
        );
      })}
    </CardColumns>
  </Container>
  </>
);
    };

    export default SavedBooks;