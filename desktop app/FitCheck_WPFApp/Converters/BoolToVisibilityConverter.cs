using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace FitCheck_WPFApp.Converters
{
    public class BoolToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            bool invert = parameter != null && parameter.ToString().ToLower() == "inverse";
            bool boolValue = value is bool b && b;

            if (invert)
                return boolValue ? Visibility.Collapsed : Visibility.Visible;
            else
                return boolValue ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is Visibility visibility)
            {
                bool invert = parameter != null && parameter.ToString().ToLower() == "inverse";
                bool result = visibility == Visibility.Visible;
                return invert ? !result : result;
            }

            return false;
        }
    }
}