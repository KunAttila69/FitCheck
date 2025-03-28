using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
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
            set
            {
                if (SetProperty(ref _selectedUser, value) && value != null)
                {
                    LoadUserRoles();
                }
            }
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

        private ObservableCollection<string> _availableRoles;
        public ObservableCollection<string> AvailableRoles
        {
            get => _availableRoles;
            set => SetProperty(ref _availableRoles, value);
        }

        private string _selectedRole;
        public string SelectedRole
        {
            get => _selectedRole;
            set => SetProperty(ref _selectedRole, value);
        }

        public ICommand BanUserCommand { get; }
        public ICommand UnbanUserCommand { get; }
        public ICommand RefreshCommand { get; }
        public ICommand PromoteUserCommand { get; }
        public ICommand DemoteUserCommand { get; }

        public UsersViewModel(ApiService apiService, LogService logService, AuthService authService)
        {
            _apiService = apiService;
            _logService = logService;
            _authService = authService;
            _users = new ObservableCollection<User>();
            _availableRoles = new ObservableCollection<string> { "User", "Moderator", "Administrator" };

            BanUserCommand = new RelayCommand(async param => await BanUserAsync(), param => SelectedUser != null && !SelectedUser.IsBanned);
            UnbanUserCommand = new RelayCommand(async param => await UnbanUserAsync(), param => SelectedUser != null && SelectedUser.IsBanned);
            RefreshCommand = new RelayCommand(async param => await LoadUsersAsync());

            PromoteUserCommand = new RelayCommand(
                async param => await PromoteUserAsync(),
                param => CanPromoteUser()
            );

            DemoteUserCommand = new RelayCommand(
                async param => await DemoteUserAsync(),
                param => CanDemoteUser()
            );

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
                string reason = await ShowBanDialogAsync();
                if (string.IsNullOrEmpty(reason))
                    return; 

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
                    $"User {SelectedUser.Username} was unbanned."
                );

                await LoadUsersAsync();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void FilterUsers()
        {
            if (string.IsNullOrWhiteSpace(SearchQuery))
            {
                Task.Run(LoadUsersAsync);
                return;
            }

            var query = SearchQuery.ToLower();
            var filteredUsers = Users.Where(u =>
                u.Username.ToLower().Contains(query) ||
                (u.Bio != null && u.Bio.ToLower().Contains(query))
            ).ToList();

            Users = new ObservableCollection<User>(filteredUsers);
        }

        private Task<string> ShowBanDialogAsync()
        {
            var tcs = new TaskCompletionSource<string>();
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

        private async Task LoadUserRoles()
        {
            if (SelectedUser == null) return;

            try
            {
                var roles = await _apiService.GetUserRolesAsync(SelectedUser.Id);
                if (SelectedUser.Roles == null)
                    SelectedUser.Roles = new List<string>();

                SelectedUser.Roles.Clear();
                foreach (var role in roles)
                {
                    SelectedUser.Roles.Add(role);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to load user roles: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private bool CanPromoteUser()
        {
            if (SelectedUser == null || string.IsNullOrEmpty(SelectedRole))
                return false;

            return SelectedUser.Roles == null || !SelectedUser.Roles.Contains(SelectedRole);
        }

        private bool CanDemoteUser()
        {
            if (SelectedUser == null || string.IsNullOrEmpty(SelectedRole))
                return false;

            return SelectedUser.Roles != null && SelectedUser.Roles.Contains(SelectedRole);
        }

        private async Task PromoteUserAsync()
        {
            if (SelectedUser == null || string.IsNullOrEmpty(SelectedRole)) return;

            try
            {
                await _apiService.AssignRoleToUserAsync(SelectedUser.Id, SelectedRole);
                await _logService.LogActionAsync(
                    AdminActionType.ModifyUserRole,
                    _authService.GetCurrentUserId(),
                    _authService.GetCurrentUsername(),
                    SelectedUser.Id,
                    $"Role '{SelectedRole}' assigned to user {SelectedUser.Username}."
                );

                await LoadUserRoles();

                MessageBox.Show($"Role '{SelectedRole}' assigned to {SelectedUser.Username} successfully.",
                    "Success", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to assign role: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async Task DemoteUserAsync()
        {
            if (SelectedUser == null || string.IsNullOrEmpty(SelectedRole)) return;

            try
            {
                var currentUserId = _authService.GetCurrentUserId();
                if (SelectedUser.Id == currentUserId && SelectedRole == "Administrator")
                {
                    MessageBox.Show("You cannot remove your own Administrator role.",
                        "Operation Denied", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                await _apiService.RemoveRoleFromUserAsync(SelectedUser.Id, SelectedRole);
                await _logService.LogActionAsync(
                    AdminActionType.ModifyUserRole,
                    currentUserId,
                    _authService.GetCurrentUsername(),
                    SelectedUser.Id,
                    $"Role '{SelectedRole}' removed from user {SelectedUser.Username}."
                );

                await LoadUserRoles();

                MessageBox.Show($"Role '{SelectedRole}' removed from {SelectedUser.Username} successfully.",
                    "Success", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to remove role: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }

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