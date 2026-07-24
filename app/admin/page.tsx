case 'service':
      return BriefcaseIcon
    case 'portfolio':
      return FolderIcon
    case 'career':
      return UserGroupIcon
    case 'application':
      return EnvelopeIcon
    case 'contact':
      return ChartBarIcon
    default:
      return ClockIcon
  }
}

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'service':
      return 'text-blue-600 bg-blue-100'
    case 'portfolio':
      return 'text-green-600 bg-green-100'
    case 'career':
      return 'text-purple-600 bg-purple-100'
    case 'application':
      return 'text-orange-600 bg-orange-100'
    case 'contact':
      return 'text-pink-600 bg-pink-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Link
              key={metric.id}
              href={metric.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change >= 0 ? (
                          <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                        )}
                        <span className="sr-only">
                          {metric.change >= 0 ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(metric.change)}
                      </div>
                    </dd>
                    <dd className="text-xs text-gray-500 mt-1">
                      {metric.period}
                    </dd>
                  </dl>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/services/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <PlusIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Add Service
              </span>
            </Link>
            <Link
              href="/admin/portfolio/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <PlusIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Add Portfolio Item
              </span>
            </Link>
            <Link
              href="/admin/careers/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <PlusIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Post Job
              </span>
            </Link>
            <Link
              href="/admin/applications"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <EnvelopeIcon className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                View Applications
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, activityIdx) => {
                const Icon = getActivityIcon(activity.type)
                const colorClasses = getActivityColor(activity.type)
                
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${colorClasses}`}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {activity.user}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}