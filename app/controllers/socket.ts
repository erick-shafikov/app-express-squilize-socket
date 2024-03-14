import { Server, Socket as NativeSocket, RemoteSocket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "@app/models/user";
import eventBus from "@app/global/events";
import Message from "@app/models/message";
import { AUTH_JWT_ALG, AUTH_JWT_SECRET } from "@app/constants/jwt";
import { Server as HttpServer } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Socket = NativeSocket & { auth?: jwt.JwtPayload | string };

let io: Server | null = null;

const activeUsers: Record<any, any> = {};
const notificationsHistory: any[] = [];

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", async function (socket: Socket) {
    const token = socket.handshake.headers.authorization ?? "null";

    try {
      const tokenData = jwt.verify(token, AUTH_JWT_SECRET, {
        algorithms: [AUTH_JWT_ALG],
      }) as jwt.JwtPayload;

      socket.auth = tokenData as jwt.JwtPayload;
      const user = await User.findByPk(socket.auth.id);

      if (user) {
        activeUsers[user.id] = user.toJSON();

        socket.on("disconnect", () => onDisconnect(user.id.toString()));

        socket.on(
          "chat.create",
          async function (
            data: Record<string, string>,
            callback: (res: object) => void
          ) {
            try {
              const message = await Message.create({
                content: data.text,
                UserId: (socket.auth as jwt.JwtPayload).id,
              });
              const user = await message.getUser();
              const result = {
                ...message.toJSON(),
                User: (user as any).toJSON(),
              };
              callback({ res: true, message: result });
              socket.broadcast.emit("chat.message", result);
            } catch (e: any) {
              callback({ res: false, error: e.message });
            }
          }
        );

        sendUpdatedUserList();
        sendNotificationHistory(socket);
        sendChatHistory(socket);
      }
    } catch (e) {
      console.log("some moron with bad token or token exp", e);
      socket.disconnect();
    }
  });

  eventBus.addListener("Model.Post.created", async function (post) {
    const sockets = await io!.fetchSockets();
    const notify = { type: "post.create", item: post.toJSON() };
    notificationsHistory.push(notify);

    sockets.forEach(
      (
        socket: RemoteSocket<DefaultEventsMap, any> & { auth?: jwt.JwtPayload }
      ) => {
        if ((socket.auth as jwt.JwtPayload).id !== post.UserId) {
          socket.emit("notification.created", notify);
        }
      }
    );
  });
}

function sendNotificationHistory(socket: Socket) {
  notificationsHistory.forEach((notify) => {
    if (
      notify.type === "post.create" &&
      notify.item.UserId !== (socket.auth as jwt.JwtPayload).id
    ) {
      socket.emit("notification.created", notify);
    }
  });
}

function onDisconnect(userId: string) {
  delete activeUsers[userId];

  sendUpdatedUserList();
}

function sendUpdatedUserList() {
  io!.emit("users.list", Object.values(activeUsers));
}

async function sendChatHistory(socket: Socket) {
  const messages = await Message.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
    include: ["User"],
  });

  messages.forEach((message) => socket.emit("chat.message", message));
}
