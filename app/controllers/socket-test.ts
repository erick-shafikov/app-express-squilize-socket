// проексперементировать с namespace и room
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const socketTest = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // io.engine.on("initial_headers", (headers, req) => {
  //   headers["test"] = "123";
  //   headers["set-cookie"] = "myCookie=456";
  // });

  io.on("connection", (socket) => {
    // const count2 = io.of("/").sockets.size;
    // console.log("count:", count2);
    // console.log("socket id:", socket.id);
    // const count = io.engine.clientsCount;
    // console.log("count:", count);

    socket.on("disconnect", () => {
      // console.log(socket.connected);
    });

    /* 
    //слушатель события server.event, код на FE
    socket.on("server.event", (args) => {
      console.log(args);//from server
    });
    */
    socket.emit("server.event", "from server");

    socket.on("client.event", (args) => {
      console.log(args);
    });

    socket.on("client.event.cb", (arg1, callback) => {
      console.log(arg1); // 1
      callback({
        status: "arg from server to execute on client",
      });
    });

    socket.emit(
      "server.event.cb",
      "string arg from server",
      (response: { status: string }) => {
        console.log(response.status);
      }
    );

    const x = socket.emit("plus", "plus", (a: number, b: number) => {
      console.log(a + b);
    });
  });

  // io.disconnectSockets();

  /* // namespace connection
  io.of("/socket").on("connection", (socket) => {
    const count2 = io.of("/socket").sockets.size;
    console.log("count:", count2);
  }); */

  // errors handlers
  io.engine.on("connection_error", (err) => {
    console.log("error");
    // console.log("socket io error", err.req); // the request object
    // console.log("socket io error", err.code); // the error code, for example 1
    // console.log("socket io error", err.message); // the error message, for example "Session ID unknown"
    // console.log("socket io error", err.context); // some additional error context
  });

  /* 
    io.engine.generateId = (req) => {
      return uuid.v4(); // must be unique across all Socket.IO servers
    }
  */
};

export default socketTest;
