using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class CommentsViewModel : ViewModelBase
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;

        private ObservableCollection<Comment> _comments;
        public ObservableCollection<Comment> Comments
        {
            get => _comments;
            set => SetProperty(ref _comments, value);
        }

        private Comment _selectedComment;
        public Comment SelectedComment
        {
            get => _selectedComment;
            set => SetProperty(ref _selectedComment, value);
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
                    FilterComments();
                }
            }
        }

        private string _removalReason;
        public string RemovalReason
        {
            get => _removalReason;
            set => SetProperty(ref _removalReason, value);
        }

        public ICommand RemoveCommentCommand { get; }
        public ICommand RefreshCommand { get; }

        public CommentsViewModel(ApiService apiService, LogService logService)
        {
            _apiService = apiService;
            _logService = logService;
            _comments = new ObservableCollection<Comment>();

            RemoveCommentCommand = new RelayCommand(async param => await RemoveCommentAsync(), param => SelectedComment != null);
            RefreshCommand = new RelayCommand(async param => await LoadCommentsAsync());

            Task.Run(LoadCommentsAsync);
        }

        private async Task LoadCommentsAsync()
        {
            IsLoading = true;
            try
            {
                var comments = await _apiService.GetAllCommentsAsync();
                Comments = new ObservableCollection<Comment>(comments);
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

        private async Task RemoveCommentAsync()
        {
            if (SelectedComment == null) return;

            try
            {
                await _apiService.RemoveCommentAsync(SelectedComment.Id, RemovalReason);
                await _logService.LogActionAsync(
                    AdminActionType.RemoveComment,
                    "mskvszkyt", // Current logged in admin username
                    "mskvszkyt",
                    SelectedComment.Id.ToString(),
                    $"Comment {SelectedComment.Id} by {SelectedComment.AuthorUsername} was removed. Reason: {RemovalReason}"
                );

                Comments.Remove(SelectedComment);
                SelectedComment = null;
                RemovalReason = string.Empty;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void FilterComments()
        {
            // Implementation would filter comments based on search query
        }
    }
}