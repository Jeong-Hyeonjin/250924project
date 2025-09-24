"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CameraIcon, 
  PhotoIcon,
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { 
  SunIcon,
  MoonIcon,
  StarIcon as SolidStarIcon
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockFoodLogs = [
  {
    id: "1",
    imageUrl: "/api/placeholder/400/300",
    mealType: "아침",
    items: [
      { foodName: "현미밥", quantity: "1 공기", calories: 310 },
      { foodName: "된장찌개", quantity: "1 그릇", calories: 120 },
      { foodName: "김치", quantity: "1 접시", calories: 25 }
    ],
    totalCalories: 455,
    loggedAt: "2024-09-24T07:30:00Z",
    createdAt: "2024-09-24T07:30:00Z"
  },
  {
    id: "2", 
    imageUrl: "/api/placeholder/400/300",
    mealType: "점심",
    items: [
      { foodName: "불고기", quantity: "1 인분", calories: 520 },
      { foodName: "쌀밥", quantity: "1 공기", calories: 290 },
      { foodName: "샐러드", quantity: "1 접시", calories: 85 }
    ],
    totalCalories: 895,
    loggedAt: "2024-09-24T12:15:00Z", 
    createdAt: "2024-09-24T12:15:00Z"
  }
];

type UploadState = "idle" | "uploading" | "analyzing" | "success" | "error";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState<string>("전체");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [foodLogs, setFoodLogs] = useState(mockFoodLogs);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mealTypes = ["전체", "아침", "점심", "저녁", "간식"];
  
  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "아침": return <SunIcon className="w-4 h-4 text-yellow-500" />;
      case "점심": return <SunIcon className="w-4 h-4 text-orange-500" />;
      case "저녁": return <MoonIcon className="w-4 h-4 text-indigo-500" />;
      case "간식": return <SolidStarIcon className="w-4 h-4 text-pink-500" />;
      default: return null;
    }
  };

  const filteredLogs = selectedMeal === "전체" 
    ? foodLogs 
    : foodLogs.filter(log => log.mealType === selectedMeal);

  const todayTotalCalories = foodLogs.reduce((sum, log) => sum + log.totalCalories, 0);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate upload and analysis process
    setUploadState("uploading");
    
    setTimeout(() => {
      setUploadState("analyzing");
    }, 1000);

    setTimeout(() => {
      // Mock successful analysis result
      const now = new Date();
      const currentHour = now.getHours();
      let mealType = "간식";
      
      if (currentHour >= 4 && currentHour < 11) mealType = "아침";
      else if (currentHour >= 11 && currentHour < 17) mealType = "점심";  
      else if (currentHour >= 17 && currentHour < 22) mealType = "저녁";

      const newLog = {
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(file),
        mealType,
        items: [
          { foodName: "분석된 음식", quantity: "1 인분", calories: 450 }
        ],
        totalCalories: 450,
        loggedAt: now.toISOString(),
        createdAt: now.toISOString()
      };

      setFoodLogs(prev => [newLog, ...prev]);
      setUploadState("success");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setUploadState("idle");
      }, 2000);
    }, 3000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/'}
                className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center hover:shadow-md transition-shadow"
              >
                <ChartBarIcon className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">나의 식단</h1>
                <p className="text-sm text-gray-500">오늘 {todayTotalCalories}kcal</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <CalendarDaysIcon className="w-4 h-4 mr-2" />
              {selectedDate}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Button - Central Focus */}
        <div className="mb-8">
          <motion.div
            className="relative"
            whileHover={{ scale: uploadState === "idle" ? 1.02 : 1 }}
            whileTap={{ scale: uploadState === "idle" ? 0.98 : 1 }}
          >
            <Button
              onClick={handleCameraClick}
              disabled={uploadState !== "idle"}
              className={`w-full h-32 text-lg font-semibold relative overflow-hidden ${
                uploadState !== "idle" ? "cursor-not-allowed" : ""
              }`}
              size="lg"
            >
              <AnimatePresence mode="wait">
                {uploadState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <CameraIcon className="w-8 h-8" />
                      <PlusIcon className="w-6 h-6" />
                    </div>
                    <span>식단 기록하기</span>
                    <span className="text-sm opacity-75">사진을 찍거나 선택하세요</span>
                  </motion.div>
                )}
                
                {uploadState === "uploading" && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <PhotoIcon className="w-8 h-8" />
                    </motion.div>
                    <span>이미지 업로드 중...</span>
                  </motion.div>
                )}

                {uploadState === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChartBarIcon className="w-8 h-8" />
                    </motion.div>
                    <span>AI 분석 중...</span>
                    <span className="text-sm opacity-75">음식을 인식하고 영양성분을 분석합니다</span>
                  </motion.div>
                )}

                {uploadState === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                    <span>기록 완료!</span>
                  </motion.div>
                )}

                {uploadState === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <ExclamationTriangleIcon className="w-8 h-8" />
                    <span>오류가 발생했습니다</span>
                    <span className="text-sm opacity-75">다시 시도해주세요</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              capture="environment"
            />
          </motion.div>
        </div>

        {/* Meal Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {mealTypes.map((meal) => (
              <Button
                key={meal}
                variant={selectedMeal === meal ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMeal(meal)}
                className="whitespace-nowrap flex items-center space-x-1"
              >
                {getMealIcon(meal)}
                <span>{meal}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Food Logs */}
        <div className="space-y-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={log.imageUrl}
                      alt="식단 이미지"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getMealIcon(log.mealType)}
                        <span className="font-medium text-gray-900">{log.mealType}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(log.loggedAt).toLocaleTimeString('ko-KR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-emerald-600">
                          {log.totalCalories}kcal
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {log.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.foodName} ({item.quantity})
                          </span>
                          <span className="text-gray-500">{item.calories}kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedMeal === "전체" ? "아직 기록된 식단이 없어요" : `${selectedMeal} 기록이 없어요`}
              </h3>
              <p className="text-gray-500 mb-4">
                위의 버튼을 눌러 첫 식단을 기록해보세요!
              </p>
            </motion.div>
          )}
        </div>

        {/* Daily Summary */}
        {foodLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-emerald-50 rounded-xl p-4"
          >
            <h3 className="font-semibold text-emerald-900 mb-3">오늘의 요약</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {todayTotalCalories}
                </div>
                <div className="text-sm text-emerald-700">총 칼로리</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {foodLogs.length}
                </div>
                <div className="text-sm text-emerald-700">기록 수</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
