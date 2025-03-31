using Xunit;
using FitCheck_WPFApp.ViewModels;
using FitCheck_WPFApp.Services;
using Moq;
using System.Threading.Tasks;
using System.Windows.Controls;

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
        var passwordBox = new PasswordBox { Password = "password123" };
        await viewModel.LoginCommand.Execute(passwordBox);

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
        var passwordBox = new PasswordBox { Password = "wrongpassword" };
        await viewModel.LoginCommand.Execute(passwordBox);

        // Assert
        Assert.True(viewModel.HasError);
        Assert.Equal("Invalid username or password", viewModel.ErrorMessage);
    }
}