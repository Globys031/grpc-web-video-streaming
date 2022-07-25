import {grpc} from "@improbable-eng/grpc-web";
import {BookService} from "../proto/examplecom/library/book_service_pb_service";
import {QueryBooksRequest, Book, GetBookRequest} from "../proto/examplecom/library/book_service_pb";

declare const USE_TLS: boolean;
const host = USE_TLS ? "https://127.0.0.1:9091" : "http://127.0.0.1:9090";

function getBook() {
  const getBookRequest = new GetBookRequest();
  getBookRequest.setIsbn(60929871);

  var customHeaders:grpc.Metadata = new grpc.Metadata;
  // customHeaders.append("Access-Control-Allow-Origin", "127.0.0.1:8080")
  // customHeaders.append("referer", "127.0.0.1:8080")
  // customHeaders.append("Origin", "http://127.0.0.1:8080")

  grpc.unary(BookService.GetBook, {
    request: getBookRequest,
    host: host,
    metadata: customHeaders,
    onEnd: res => {
      const { status, statusMessage, headers, message, trailers } = res;
      console.log("getBook.onEnd.status", status, statusMessage);
      console.log("getBook.onEnd.headers", headers);
      if (status === grpc.Code.OK && message) {
        console.log("getBook.onEnd.message", message.toObject());
      }
      console.log("getBook.onEnd.trailers", trailers);
      queryBooks();
    }
  });
}

function queryBooks() {
  const queryBooksRequest = new QueryBooksRequest();
  queryBooksRequest.setAuthorPrefix("Geor");
  const client = grpc.client(BookService.QueryBooks, {
    host: host,
  });
  // var customHeaders:grpc.Metadata = new grpc.Metadata;
  // customHeaders.append("Access-Control-Allow-Origin", "*")
  client.onHeaders((headers: grpc.Metadata, ) => {
    console.log("queryBooks.onHeaders", headers);
  });
  console.log("would you like some life insurance, yes?")
  client.onMessage((message: Book) => {
    console.log("queryBooks.onMessage", message.toObject());
  });
  client.onEnd((code: grpc.Code, msg: string, trailers: grpc.Metadata) => {
    console.log("queryBooks.onEnd", code, msg, trailers);
  });
  client.start();
  client.send(queryBooksRequest);
}

getBook();