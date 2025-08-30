package api

import (
	"fmt"
	"net/http"
)

type CredentialHandler struct{}

func NewCredentialHandler() *CredentialHandler {
	return &CredentialHandler{}
}

func (*CredentialHandler) SetCredentials(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("SetCredentials function handler called")
}

func (*CredentialHandler) GetCredentials(w http.ResponseWriter, r *http.Request) {
	fmt.Println("send credentials in json")
}
