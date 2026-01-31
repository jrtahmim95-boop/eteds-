
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;

class PlannerScreen extends StatefulWidget {
  const PlannerScreen({super.key});

  @override
  State<PlannerScreen> createState() => _PlannerScreenState();
}

class _PlannerScreenState extends State<PlannerScreen> {
  final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();

  @override
  void initState() {
    super.initState();
    _initNotifications();
  }

  Future<void> _initNotifications() async {
    tz.initializeTimeZones();
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings initializationSettingsIOS = DarwinInitializationSettings();
    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );
    await _notifications.initialize(initializationSettings);
  }

  Future<void> _scheduleTomorrowNotification(int id, String title, TimeOfDay time) async {
    final now = DateTime.now();
    var scheduledDate = DateTime(now.year, now.month, now.day + 1, time.hour, time.minute);

    await _notifications.zonedSchedule(
      id,
      'Target Tomorrow!',
      'Time for: $title',
      tz.TZDateTime.from(scheduledDate, tz.local),
      const NotificationDetails(
        android: AndroidNotificationDetails('target_id', 'Targets', channelDescription: 'Tomorrow Plans'),
        iOS: DarwinNotificationDetails(),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1B2A),
      appBar: AppBar(title: const Text("Tomorrow's Plan")),
      body: Column(
        children: [
          // Input for new target
          // List of targets with toggle for notification
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Logic to add task and call _scheduleTomorrowNotification
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
