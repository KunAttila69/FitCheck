using FitCheck_Server.DTOs;
using Xunit;

public class LoginRequestTests
{
    [Fact]
    public void LoginRequest_ValidInput_ShouldSetProperties()
    {
       var loginRequest = new LoginRequest
       {
           Username = "testuser",
           Password = "password123"
       };



        // Act & Assert
        Assert.Equal("testuser", loginRequest.Username);
        Assert.Equal("password123", loginRequest.Password);
    }
}