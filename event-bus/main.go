package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

var events []map[string]interface{}

func main() {

	http.HandleFunc("/events", getEvent)

	log.Println("starting server on port 4005")
	err := http.ListenAndServe(":4005", nil)
	if err != nil {
		log.Panicln(err)
	}
}

func getEvent(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodGet {
		mEvents, err := json.Marshal(events)
		if err != nil {
			log.Println(err)
		}

		w.Write(mEvents)

		return
	}

	if req.Method == http.MethodPost {
		var payload map[string]interface{}

		body, err := io.ReadAll(req.Body)
		if err != nil {
			log.Println(err)
		}
		json.Unmarshal(body, &payload)

		fmt.Println("Event:", payload)

		events = append(events, payload)

		clients := []string{
			"http://posts-clusterip-srv:4000/events",
			"http://comments-srv:4001/events",
			"http://query-srv:4002/events",
			"http://moderation-srv:4003/events",
		}

		for _, client := range clients {
			go func(client string) {
				_, err := http.Post(client, "application/json", bytes.NewBuffer(body))
				if err != nil {
					log.Println(fmt.Errorf("error while trying to send message to %s service: %w", client, err))
				}
			}(client)
		}
	}
}
