package chat

// https://github.com/grpc/grpc-go/blob/master/Documentation/concurrency.md#servers
// each gRPC handler is its own goroutine. Meaning, every rpc implementation here
// gets issued as a separate goroutine

import (
	"errors"
	"fmt"
	library "grpc-web-video-streaming/chatServer/go/protoLibrary"
	"io"
	"sync"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type ChatService struct {
	library.UnimplementedChatServiceServer

	GlobalChatroomID int32
	ChanArr          map[int32][]chan *library.Message // Maps a slice of channels
	Mutex            sync.Mutex
}

//////////////////////////////////////////////////////
//// Grpc implemented methods
//////////////////////////////////////////////////////
//
//
func (s *ChatService) JoinChatroom(chatroom *library.Chatroom, msgStream library.ChatService_JoinChatroomServer) error {
	// Creates chatroom if doesn't already exist
	userMsgChannel := make(chan *library.Message, 10)
	s.Mutex.Lock()
	s.ChanArr[chatroom.Id] = append(s.ChanArr[chatroom.Id], userMsgChannel)
	s.Mutex.Unlock()

	// Keep receiving messsages until the server closes the stream
	for {
		select {
		case <-msgStream.Context().Done():
			return nil
		case msg := <-userMsgChannel:
			fmt.Printf("GO ROUTINE (got message): %v \n", msg)
			msgStream.Send(msg)
		}
	}
}

func (s *ChatService) SendMessage(msgStream library.ChatService_SendMessageServer) error {
	msg, err := msgStream.Recv()
	if err == io.EOF { // if stream was closed
		return errors.New("Can't send any more messages because the stream was closed")
	}
	if err != nil { // for any other type of error
		return err
	}

	// Sever received message and will proceed to send messages after notifying the user
	serverResponse := library.Response{Msg: "Server received message", Error: 0}
	msgStream.SendAndClose(&serverResponse)

	// Sends message to every user in the chatroom
	channels := s.ChanArr[msg.ChatroomID]
	for _, msgChan := range channels {
		msgChan <- msg
	}
	return nil
}

func (s *ChatService) InviteToChatroom(ctx context.Context, user *library.User) (*library.Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method InviteToChatroom not implemented")
}

func (s *ChatService) ListUsers(ctx context.Context, chatroom *library.Chatroom) (*library.UserArray, error) {
	// Return an error in case there's 0 or less users.
	// A chatroom can't exist without at least one user
	if len(chatroom.Users) > 0 {
		return &library.UserArray{Users: chatroom.Users}, nil
	} else {
		return nil, grpc.Errorf(codes.FailedPrecondition, "Couldn't find any users in the chatroom")
	}
}

func (s *ChatService) Leave(ctx context.Context, user *library.User) (*library.Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Leave not implemented")
}

//
//
//////////////////////////////////////////////////////////
