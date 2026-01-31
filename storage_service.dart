
import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox('settings');
    await Hive.openBox('logs');
  }

  static void saveUserRole(String role) {
    var box = Hive.box('settings');
    box.put('userRole', role);
    box.put('isOnboarded', true);
  }

  static String getUserRole() {
    var box = Hive.box('settings');
    return box.get('userRole', defaultValue: 'Guest');
  }
}
