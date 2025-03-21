using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class UsersViewModel : ViewModelBase
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;
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

        public UsersViewModel(ApiService apiService, LogService logService)
        {
            _apiService = apiService;
            _logService = logService;
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
                Users = new ObservableCollection<User>(users);
                foreach (var user in Users)
                {
                    if (user.ProfilePictureUrl != null)
                    {
                        user.ProfilePictureUrl = _baseRootUrl + user.ProfilePictureUrl;
                    }
                }
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
                await _apiService.BanUserAsync(SelectedUser.Id);
                await _logService.LogActionAsync(
                    AdminActionType.BanUser,
                    "admin", // Replace with actual admin ID
                    "admin", // Replace with actual admin username
                    SelectedUser.Id,
                    $"User {SelectedUser.Username} was banned"
                );

                // Update user in the list
                SelectedUser.IsBanned = true;
                SelectedUser.BannedUntil = null;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                // Log or handle the error
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
                    "admin", // Replace with actual admin ID
                    "admin", // Replace with actual admin username
                    SelectedUser.Id,
                    $"User {SelectedUser.Username} was unbanned"
                );

                // Update user in the list
                SelectedUser.IsBanned = false;
                SelectedUser.BannedUntil = null;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                // Log or handle the error
            }
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