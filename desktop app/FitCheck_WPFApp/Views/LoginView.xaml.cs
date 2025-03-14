using FitCheck_WPFApp.Services;
using FitCheck_WPFApp.ViewModels;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace FitCheck_WPFApp.Views
{
    public partial class LoginView : UserControl
    {
        public event EventHandler LoginSuccessful;
        private LoginViewModel _viewModel;

        public LoginView(AuthService authService)
        {
            InitializeComponent();
            _viewModel = new LoginViewModel(authService);
            _viewModel.LoginSuccess += (s, e) => LoginSuccessful?.Invoke(this, EventArgs.Empty);
            DataContext = _viewModel;
        }
    }

    public class LoginViewModel : ViewModelBase
    {
        private readonly AuthService _authService;

        private string _username;
        public string Username
        {
            get => _username;
            set => SetProperty(ref _username, value);
        }

        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set => SetProperty(ref _errorMessage, value);
        }

        private bool _hasError;
        public bool HasError
        {
            get => _hasError;
            set => SetProperty(ref _hasError, value);
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set => SetProperty(ref _isLoading, value);
        }

        public ICommand LoginCommand { get; }

        public event EventHandler LoginSuccess;

        public LoginViewModel(AuthService authService)
        {
            _authService = authService;
            LoginCommand = new RelayCommand(async param =>
            {
                HasError = false;
                IsLoading = true;

                var passwordBox = param as PasswordBox;
                string password = passwordBox?.Password ?? string.Empty;

                if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(password))
                {
                    ErrorMessage = "Username and password are required";
                    HasError = true;
                    IsLoading = false;
                    return;
                }

                try
                {
                    bool success = await _authService.LoginAsync(Username, password);
                    if (success)
                    {
                        LoginSuccess?.Invoke(this, EventArgs.Empty);
                    }
                    else
                    {
                        ErrorMessage = "Invalid username or password";
                        HasError = true;
                    }
                }
                catch (Exception ex)
                {
                    ErrorMessage = $"Login failed: {ex.Message}";
                    HasError = true;
                }
                finally
                {
                    IsLoading = false;
                }
            });
        }
    }
}