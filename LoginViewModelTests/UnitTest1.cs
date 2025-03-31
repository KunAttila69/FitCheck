using Xunit;
using Moq;
using System.Threading.Tasks;

public class LoginViewModelTests
{
    [Fact]
    public async Task LoginViewModel_ValidLogin_ShouldTriggerLoginSuccess()
    {
        // Arrange
        var authServiceMock = new Mock<AuthService>();
        authServiceMock.Setup(service => service.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var viewModel = new LoginViewModel(authServiceMock.Object);
        var wasLoginSuccessful = false;
        viewModel.LoginSuccess += (s, e) => wasLoginSuccessful = true;

        // Act
        viewModel.Username = "testuser";
        viewModel.Password = "password123";
        await viewModel.LoginCommand.Execute(null);

        // Assert
        Assert.True(wasLoginSuccessful);
    }

    [Fact]
    public async Task LoginViewModel_InvalidLogin_ShouldSetErrorMessage()
    {
        // Arrange
        var authServiceMock = new Mock<AuthService>();
        authServiceMock.Setup(service => service.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(false);

        var viewModel = new LoginViewModel(authServiceMock.Object);

        // Act
        viewModel.Username = "testuser";
        viewModel.Password = "wrongpassword";
        await viewModel.LoginCommand.Execute(null);

        // Assert
        Assert.True(viewModel.HasError);
        Assert.Equal("Invalid username or password", viewModel.ErrorMessage);
    }
}