using FitCheck_WPFApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace FitCheck_WPFApp.Services
{
    public class LogService
    {
        private readonly string _logFilePath = "admin_logs.json";
        private List<AdminLog> _logs;

        public LogService()
        {
            LoadLogs();
        }

        private void LoadLogs()
        {
            try
            {
                if (File.Exists(_logFilePath))
                {
                    string json = File.ReadAllText(_logFilePath);
                    _logs = JsonSerializer.Deserialize<List<AdminLog>>(json) ?? new List<AdminLog>();
                }
                else
                {
                    _logs = new List<AdminLog>();
                    // Create the file with empty array
                    File.WriteAllText(_logFilePath, JsonSerializer.Serialize(_logs));
                }
            }
            catch (Exception e)
            {
                MessageBox.Show(_logFilePath + " could not be loaded. " + e.Message + "New log file initialized.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                _logs = new List<AdminLog>();
            }
        }

        private async Task SaveLogsAsync()
        {
            try
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                string json = JsonSerializer.Serialize(_logs, options);
                await File.WriteAllTextAsync(_logFilePath, json);
            }
            catch (Exception)
            {
                MessageBox.Show(_logFilePath + " could not be saved.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public async Task LogActionAsync(AdminActionType actionType, string adminId, string adminUsername, string targetId, string description)
        {
            var log = new AdminLog
            {
                Id = _logs.Count > 0 ? _logs.Max(l => l.Id) + 1 : 1,
                AdminId = adminId,
                AdminUsername = adminUsername,
                ActionType = actionType,
                TargetId = targetId,
                Description = description,
                Timestamp = DateTime.UtcNow
            };

            _logs.Add(log);
            await SaveLogsAsync();
        }

        public List<AdminLog> GetLogs()
        {
            return _logs.OrderByDescending(l => l.Timestamp).ToList();
        }

        public Task<IEnumerable<AdminLog>> GetLogsAsync(DateTime startDate, DateTime endDate)
        {
            var startDateUtc = startDate.Kind != DateTimeKind.Utc ? startDate.ToUniversalTime() : startDate;
            var endDateUtc = endDate.Kind != DateTimeKind.Utc ? endDate.ToUniversalTime() : endDate;

            endDateUtc = endDateUtc.AddDays(1);

            var filteredLogs = _logs
                .Where(l => l.Timestamp >= startDateUtc && l.Timestamp < endDateUtc)
                .OrderByDescending(l => l.Timestamp)
                .ToList();

            return Task.FromResult<IEnumerable<AdminLog>>(filteredLogs);
        }
    }
}