package main

import (
	"context"
	"fmt"
	"log"
	"strings"

	firebase "firebase.google.com/go"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

func main() {
	r := gin.Default()
	r.Use(corsMiddleware())
	api := r.Group("/api")
	routing(api)
	r.Run("localhost:8080")
}

func routing(api *gin.RouterGroup) {

	api.GET("/auth", authMiddleware(), func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "hoge",
		})
	})

	api.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "hoge",
		})
	})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		opt := option.WithCredentialsFile("./firebase_sdk.json")
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			fmt.Printf("app error: %v\n", err)
		}
		auth, err := app.Auth(context.Background())
		if err != nil {
			fmt.Printf("auth error: %v\n", err)
		}

		authHeader := c.Request.Header.Get("Authorization")
		idToken := strings.Replace(authHeader, "Bearer ", "", 1)
		token, err := auth.VerifyIDToken(context.Background(), idToken)

		if err != nil {
			fmt.Printf("verfiy error: %v\n", err)
			c.JSON(401, gin.H{
				"message": "error verifying ID token",
			})
			c.Abort()
		}
		log.Printf("Verified ID token:%v\n", token)
		c.Next()
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			fmt.Println("OPTIONS")
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}
