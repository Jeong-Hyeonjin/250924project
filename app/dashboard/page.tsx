"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
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

// 타입 정의
interface FoodItem {
  foodName: string;
  confidence: number;
  quantity: string;
  calories: number;
  nutrients: {
    carbohydrates?: NutrientValue;
    protein?: NutrientValue;
    fat?: NutrientValue;
    vitamins?: NutrientValue;
    minerals?: NutrientValue;
  };
}

interface NutrientValue {
  value: number;
  unit: string;
}

interface AnalysisResult {
  items?: FoodItem[];
  summary: {
    totalCalories: number;
    totalCarbohydrates?: NutrientValue;
    totalProtein?: NutrientValue;
    totalFat?: NutrientValue;
    totalVitamins?: NutrientValue;
    totalMinerals?: NutrientValue;
  };
}

interface FoodLog {
  id: string;
  imageUrl: string;
  mealType: string;
  items: FoodItem[];
  totalCalories: number;
  loggedAt: string;
  createdAt: string;
  analysisResult?: AnalysisResult;
}

// 빈 배열로 시작 - 실제 분석 결과만 표시
const initialFoodLogs: FoodLog[] = [];

type UploadState = "idle" | "uploading" | "analyzing" | "success" | "error";

interface ErrorInfo {
  code?: string;
  message?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState<string>("전체");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [foodLogs, setFoodLogs] = useState(initialFoodLogs);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // 인증 확인 및 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 타이머 시작 함수
  const startTimer = () => {
    const startTime = Date.now();
    setAnalysisStartTime(startTime);
    setElapsedTime(0);
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
  };

  // 타이머 정지 함수
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setAnalysisStartTime(null);
    setElapsedTime(0);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 초기화
    stopTimer();

    // 업로드 상태 시작
    setUploadState("uploading");

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user?.id || 'anonymous'); // 실제 사용자 ID

      // API 호출
      const response = await fetch('/api/upload-food', {
        method: 'POST',
        body: formData,
      });

      // 분석 상태로 변경
      setUploadState("analyzing");
      startTimer();

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || '분석에 실패했습니다.');
      }

      // 성공적으로 분석 완료
      const now = new Date();
      const currentHour = now.getHours();
      let mealType = "간식";
      
      if (currentHour >= 4 && currentHour < 11) mealType = "아침";
      else if (currentHour >= 11 && currentHour < 17) mealType = "점심";  
      else if (currentHour >= 17 && currentHour < 22) mealType = "저녁";

      // n8n 분석 결과를 사용하여 새 로그 생성
      const analysisData = result.data;
      console.log('분석 데이터:', analysisData);
      
      const newLog = {
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(file),
        mealType,
        items: analysisData.items || [
          { 
            foodName: analysisData.foodName || "분석된 음식", 
            quantity: analysisData.quantity || "1 인분", 
            calories: analysisData.calories || 0 
          }
        ],
        totalCalories: analysisData.summary?.totalCalories || analysisData.totalCalories || 0,
        loggedAt: now.toISOString(),
        createdAt: now.toISOString(),
        analysisResult: analysisData
      };

      setFoodLogs(prev => [newLog, ...prev]);
      setUploadState("success");
      stopTimer();
      
      // 2초 후 초기 상태로 복귀
      setTimeout(() => {
        setUploadState("idle");
      }, 2000);

    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      stopTimer();
      
      // 에러 정보 설정
      if (error instanceof Error) {
        setErrorInfo({ message: error.message });
      } else {
        setErrorInfo({ message: '알 수 없는 오류가 발생했습니다.' });
      }
      
      setUploadState("error");
      
      // 5초 후 초기 상태로 복귀
      setTimeout(() => {
        setUploadState("idle");
        setErrorInfo(null);
      }, 5000);
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/login');
    }
  };

  // 로딩 중이거나 인증되지 않은 사용자 처리
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // useEffect에서 리다이렉트 처리
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">나의 식단</h1>
                <p className="text-sm text-gray-500">오늘 {todayTotalCalories}kcal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                {selectedDate}
              </Button>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  로그아웃
                </Button>
              </div>
            </div>
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
                    <span>식단 분석 중...</span>
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
                    <span>식단 분석 중...</span>
                    
                    {/* 타이머만 유지 */}
                    <div className="text-xs text-emerald-600 font-medium">
                      {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
                    </div>
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
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                    <span className="text-red-600">분석에 실패했습니다</span>
                    <span className="text-sm opacity-75 text-center">
                      {errorInfo?.message || "네트워크를 확인하고 다시 시도해주세요"}
                    </span>
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
                    
                    <div className="space-y-1 mb-3">
                      {log.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.foodName} ({item.quantity})
                          </span>
                          <span className="text-gray-500">{item.calories}kcal</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* 영양성분 요약 */}
                    {log.analysisResult?.summary && (
                      <div className="border-t border-gray-100 pt-3">
                        <h4 className="text-xs font-medium text-gray-600 mb-3">5대 영양소</h4>
                        
                        {/* 5대 영양소 한 줄 표시 */}
                        <div className="grid grid-cols-5 gap-1 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">
                              {Math.round(log.analysisResult.summary.totalCarbohydrates?.value || 0)}
                              {log.analysisResult.summary.totalCarbohydrates?.unit || 'g'}
                            </div>
                            <div className="text-gray-500">탄수화물</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">
                              {Math.round(log.analysisResult.summary.totalProtein?.value || 0)}
                              {log.analysisResult.summary.totalProtein?.unit || 'g'}
                            </div>
                            <div className="text-gray-500">단백질</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-yellow-600">
                              {Math.round(log.analysisResult.summary.totalFat?.value || 0)}
                              {log.analysisResult.summary.totalFat?.unit || 'g'}
                            </div>
                            <div className="text-gray-500">지방</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-orange-600">
                              {(log.analysisResult.summary.totalVitamins?.value || 0).toFixed(1)}
                              {log.analysisResult.summary.totalVitamins?.unit || 'mg'}
                            </div>
                            <div className="text-gray-500">비타민</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">
                              {(log.analysisResult.summary.totalMinerals?.value || 0).toFixed(1)}
                              {log.analysisResult.summary.totalMinerals?.unit || 'mg'}
                            </div>
                            <div className="text-gray-500">무기질</div>
                          </div>
                        </div>
                      </div>
                    )}
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
            <h3 className="font-semibold text-emerald-900 mb-4">오늘의 요약</h3>
            
            {/* 총 칼로리 및 기록 수 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
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

            {/* 5대 영양소 요약 */}
            {(() => {
              const totalNutrients = foodLogs.reduce((acc, log) => {
                const summary = log.analysisResult?.summary;
                if (summary) {
                  acc.carbs += summary.totalCarbohydrates?.value || 0;
                  acc.protein += summary.totalProtein?.value || 0;
                  acc.fat += summary.totalFat?.value || 0;
                  acc.vitamins += summary.totalVitamins?.value || 0;
                  acc.minerals += summary.totalMinerals?.value || 0;
                }
                return acc;
              }, { 
                carbs: 0, protein: 0, fat: 0,
                vitamins: 0, minerals: 0
              });

              // 식단 기록이 있으면 영양소 요약을 항상 표시 (0이어도)
              return foodLogs.length > 0 ? (
                <div className="border-t border-emerald-200 pt-4">
                  <h4 className="text-sm font-medium text-emerald-800 mb-3">5대 영양소 합계</h4>
                  
                  {/* 5대 영양소 한 줄 표시 */}
                  <div className="grid grid-cols-5 gap-2">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(totalNutrients.carbs)}g
                      </div>
                      <div className="text-xs text-gray-600">탄수화물</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(totalNutrients.protein)}g
                      </div>
                      <div className="text-xs text-gray-600">단백질</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {Math.round(totalNutrients.fat)}g
                      </div>
                      <div className="text-xs text-gray-600">지방</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {totalNutrients.vitamins.toFixed(1)}mg
                      </div>
                      <div className="text-xs text-gray-600">비타민</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {totalNutrients.minerals.toFixed(1)}mg
                      </div>
                      <div className="text-xs text-gray-600">무기질</div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </main>
    </div>
  );
}
