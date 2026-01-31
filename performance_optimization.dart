
import 'package:flutter/material.dart';
import 'package:vibration/vibration.dart';

class PerformanceManager {
  // Flag for low-end devices (e.g. 2GB RAM)
  static bool get isLowEndDevice => true; // Would be determined by device info package

  static BoxDecoration get glassDecoration => BoxDecoration(
    color: Colors.white.withOpacity(isLowEndDevice ? 0.05 : 0.1),
    borderRadius: BorderRadius.circular(24),
    // Disable heavy blur on low-end devices to save RAM/GPU
    border: Border.all(color: Colors.white10),
  );

  static void triggerCompletionHaptic() async {
    if (await Vibration.hasVibrator() ?? false) {
      // Custom vibration pattern: short, sharp buzz
      Vibration.vibrate(pattern: [0, 10, 20, 10]);
    }
  }

  // Use RepaintBoundary to cache complex parts of the UI
  static Widget optimizedList(List<Widget> children) {
    return ListView.builder(
      itemCount: children.length,
      padding: EdgeInsets.zero,
      cacheExtent: 100, // Keep memory footprint small
      itemBuilder: (context, index) => RepaintBoundary(child: children[index]),
    );
  }
}
