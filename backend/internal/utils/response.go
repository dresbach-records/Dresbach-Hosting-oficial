package utils

import (
	"github.com/gin-gonic/gin"
)

// Success envia uma resposta JSON padronizada para sucesso.
func Success(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, gin.H{
		"success": true,
		"data":    data,
	})
}

// Error envia uma resposta JSON padronizada para erro.
func Error(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, gin.H{
		"success": false,
		"error":   message,
	})
}
