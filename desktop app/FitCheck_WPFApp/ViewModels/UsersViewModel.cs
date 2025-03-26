using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Resources;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class UsersViewModel : ViewModelBase
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;
        private readonly AuthService _authService;
        private readonly string _baseRootUrl = "https://localhost:7293";

        private ObservableCollection<User> _users;
        public ObservableCollection<User> Users
        {
            get => _users;
            set => SetProperty(ref _users, value);
        }

        private User _selectedUser;
        public User SelectedUser
        {
            get => _selectedUser;
            set => SetProperty(ref _selectedUser, value);
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set => SetProperty(ref _isLoading, value);
        }

        private string _searchQuery;
        public string SearchQuery
        {
            get => _searchQuery;
            set
            {
                if (SetProperty(ref _searchQuery, value))
                {
                    FilterUsers();
                }
            }
        }

        public ICommand BanUserCommand { get; }
        public ICommand UnbanUserCommand { get; }
        public ICommand RefreshCommand { get; }

        public UsersViewModel(ApiService apiService, LogService logService, AuthService authService)
        {
            _apiService = apiService;
            _logService = logService;
            _authService = authService;
            _users = new ObservableCollection<User>();

            BanUserCommand = new RelayCommand(async param => await BanUserAsync(), param => SelectedUser != null && !SelectedUser.IsBanned);
            UnbanUserCommand = new RelayCommand(async param => await UnbanUserAsync(), param => SelectedUser != null && SelectedUser.IsBanned);
            RefreshCommand = new RelayCommand(async param => await LoadUsersAsync());

            Task.Run(LoadUsersAsync);
        }

        private async Task LoadUsersAsync()
        {
            IsLoading = true;
            try
            {
                var users = await _apiService.GetAllUsersAsync();
                foreach (User user in users)
                {
                    if (user.ProfilePictureUrl != null)
                    {
                        user.ProfilePictureUrl = _baseRootUrl + user.ProfilePictureUrl;
                    }
                    else
                    {
                        user.ProfilePictureUrl = @"Resources\default_user.png";
                    }
                }
                Users = new ObservableCollection<User>(users);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task BanUserAsync()
        {
            if (SelectedUser == null) return;

            try
            {
                // Make sure we have a reason for the ban
                string reason = await ShowBanDialogAsync();
                if (string.IsNullOrEmpty(reason))
                    return; // User cancelled the operation

                await _apiService.BanUserAsync(SelectedUser.Id, reason);
                await _logService.LogActionAsync(
                    AdminActionType.BanUser,
                    _authService.GetCurrentUserId(),
                    _authService.GetCurrentUsername(),
                    SelectedUser.Id,
                    $"User {SelectedUser.Username} was banned. Reason: {reason}"
                );

                await LoadUsersAsync();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async Task UnbanUserAsync()
        {
            if (SelectedUser == null) return;

            try
            {
                await _apiService.UnbanUserAsync(SelectedUser.Id);
                await _logService.LogActionAsync(
                    AdminActionType.UnbanUser,
                    _authService.GetCurrentUserId(),
                    _authService.GetCurrentUsername(),
                    SelectedUser.Id,
                    $"User {SelectedUser.Username} was unbanned"
                );

                await LoadUsersAsync();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private Task<string> ShowBanDialogAsync()
        {
            var tcs = new TaskCompletionSource<string>();

            // Create a simple dialog for entering ban reason
            var dialog = new Window
            {
                Title = "Ban User",
                Width = 400,
                Height = 200,
                WindowStartupLocation = WindowStartupLocation.CenterScreen,
                WindowStyle = WindowStyle.ToolWindow,
                ResizeMode = ResizeMode.NoResize
            };

            var grid = new Grid();
            grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Auto) });
            grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
            grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Auto) });

            var label = new TextBlock
            {
                Text = "Please provide a reason for banning this user:",
                Margin = new Thickness(10, 10, 10, 5)
            };
            Grid.SetRow(label, 0);

            var textBox = new TextBox
            {
                Margin = new Thickness(10),
                AcceptsReturn = true,
                TextWrapping = TextWrapping.Wrap,
                VerticalAlignment = VerticalAlignment.Stretch
            };
            Grid.SetRow(textBox, 1);

            var buttonPanel = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                HorizontalAlignment = HorizontalAlignment.Right,
                Margin = new Thickness(10)
            };
            Grid.SetRow(buttonPanel, 2);

            var cancelButton = new Button
            {
                Content = "Cancel",
                Width = 80,
                Margin = new Thickness(5, 0, 0, 0)
            };
            cancelButton.Click += (s, e) =>
            {
                tcs.SetResult(null);
                dialog.Close();
            };

            var confirmButton = new Button
            {
                Content = "Ban User",
                Width = 100,
                Margin = new Thickness(5, 0, 0, 0),
                IsDefault = true
            };
            confirmButton.Click += (s, e) =>
            {
                tcs.SetResult(textBox.Text);
                dialog.Close();
            };

            buttonPanel.Children.Add(confirmButton);
            buttonPanel.Children.Add(cancelButton);

            grid.Children.Add(label);
            grid.Children.Add(textBox);
            grid.Children.Add(buttonPanel);

            dialog.Content = grid;
            dialog.Closing += (s, e) =>
            {
                if (!tcs.Task.IsCompleted)
                    tcs.SetResult(null);
            };

            dialog.Show();

            return tcs.Task;
        }
        private void FilterUsers()
        {
            // Implementation would filter users based on search query
        }
    }

    // Simple ICommand implementation
    public class RelayCommand : ICommand
    {
        private readonly Action<object> _execute;
        private readonly Func<object, bool> _canExecute;

        public RelayCommand(Action<object> execute, Func<object, bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute(parameter);

        public void Execute(object parameter) => _execute(parameter);

        public event EventHandler CanExecuteChanged
        {
            add => CommandManager.RequerySuggested += value;
            remove => CommandManager.RequerySuggested -= value;
        }
    }
}