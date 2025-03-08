
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Sun, 
  Moon, 
  Computer, 
  X, 
  Divide, 
  Percent, 
  Plus, 
  Minus, 
  Equal, 
  Weight, 
  Database, 
  Volume2, 
  IndianRupee, 
  Gauge, 
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const SKYIOUS_CALCULATOR = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('skyious-theme');
      return (savedTheme as 'light' | 'dark' | 'system') || 'system';
    }
    return 'system';
  });
  const [activeTab, setActiveTab] = useState("standard");
  const { toast } = useToast();

  // Standard Calculator State
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // BMI Calculator State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  // Data Unit Converter State
  const [dataValue, setDataValue] = useState("");
  const [dataFromUnit, setDataFromUnit] = useState("byte");
  const [dataToUnit, setDataToUnit] = useState("kilobyte");
  const [dataResult, setDataResult] = useState("");

  // Volume Converter State
  const [volumeValue, setVolumeValue] = useState("");
  const [volumeFromUnit, setVolumeFromUnit] = useState("liter");
  const [volumeToUnit, setVolumeToUnit] = useState("milliliter");
  const [volumeResult, setVolumeResult] = useState("");

  // GST Calculator State
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [gstType, setGstType] = useState("exclusive");
  const [gstResult, setGstResult] = useState({
    baseAmount: "",
    gstAmount: "",
    totalAmount: ""
  });

  // Speed Converter State
  const [speedValue, setSpeedValue] = useState("");
  const [speedFromUnit, setSpeedFromUnit] = useState("kmh");
  const [speedToUnit, setSpeedToUnit] = useState("ms");
  const [speedResult, setSpeedResult] = useState("");

  // Next Birthday Calculator State
  const [birthdate, setBirthdate] = useState("");
  const [nextBirthdayResult, setNextBirthdayResult] = useState({
    days: 0,
    date: "",
    age: 0
  });

  // Theme Effect
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        if (systemTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } else if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [theme]);
  
  // Theme Persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skyious-theme', theme);
    }
  }, [theme]);

  // Loading Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // For Standard Calculator
  const handleNumberClick = (num: string) => {
    if (display === "0" || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimalClick = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleClearClick = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
  };

  const handleDeleteClick = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleOperationClick = (op: string) => {
    if (previousValue === null) {
      setPreviousValue(parseFloat(display));
    } else if (operation) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setPreviousValue(result);
      setDisplay(String(result));
    }
    
    setShouldResetDisplay(true);
    setOperation(op);
  };

  const handlePercentClick = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const handleEqualsClick = () => {
    if (previousValue === null || operation === null) {
      return;
    }
    
    const result = calculate(previousValue, parseFloat(display), operation);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  // For BMI Calculator
  const calculateBMI = () => {
    if (!height || !weight) {
      toast({ title: "Please enter both height and weight values" });
      return;
    }
    
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
      toast({ title: "Please enter valid values" });
      return;
    }
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setBmiResult(parseFloat(bmi.toFixed(2)));
    
    // Categorize BMI
    if (bmi < 18.5) {
      setBmiCategory("Underweight");
    } else if (bmi < 25) {
      setBmiCategory("Normal weight");
    } else if (bmi < 30) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obese");
    }
  };

  // For Data Unit Converter
  const calculateDataConversion = () => {
    if (!dataValue) {
      toast({ title: "Please enter a value to convert" });
      return;
    }
    
    const value = parseFloat(dataValue);
    if (isNaN(value) || value < 0) {
      toast({ title: "Please enter a valid value" });
      return;
    }
    
    // Convert to bytes first
    const conversionFactors: Record<string, number> = {
      "bit": 0.125,
      "byte": 1,
      "kilobyte": 1024,
      "megabyte": 1024 * 1024,
      "gigabyte": 1024 * 1024 * 1024,
      "terabyte": 1024 * 1024 * 1024 * 1024
    };
    
    const bytesValue = value * conversionFactors[dataFromUnit];
    const result = bytesValue / conversionFactors[dataToUnit];
    
    setDataResult(result.toFixed(8));
  };

  // For Volume Converter
  const calculateVolumeConversion = () => {
    if (!volumeValue) {
      toast({ title: "Please enter a value to convert" });
      return;
    }
    
    const value = parseFloat(volumeValue);
    if (isNaN(value) || value < 0) {
      toast({ title: "Please enter a valid value" });
      return;
    }
    
    // Convert to milliliters first
    const conversionFactors: Record<string, number> = {
      "milliliter": 1,
      "liter": 1000,
      "cup": 236.588,
      "pint": 473.176,
      "gallon": 3785.41,
      "cubic-meter": 1000000
    };
    
    const mlValue = value * conversionFactors[volumeFromUnit];
    const result = mlValue / conversionFactors[volumeToUnit];
    
    setVolumeResult(result.toFixed(6));
  };

  // For GST Calculator
  const calculateGST = () => {
    if (!amount) {
      toast({ title: "Please enter an amount" });
      return;
    }
    
    const amountValue = parseFloat(amount);
    const gstRateValue = parseFloat(gstRate);
    
    if (isNaN(amountValue) || isNaN(gstRateValue) || amountValue < 0 || gstRateValue < 0) {
      toast({ title: "Please enter valid values" });
      return;
    }
    
    let baseAmount, gstAmount, totalAmount;
    
    if (gstType === "exclusive") {
      baseAmount = amountValue;
      gstAmount = baseAmount * (gstRateValue / 100);
      totalAmount = baseAmount + gstAmount;
    } else { // inclusive
      totalAmount = amountValue;
      baseAmount = totalAmount / (1 + (gstRateValue / 100));
      gstAmount = totalAmount - baseAmount;
    }
    
    setGstResult({
      baseAmount: baseAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  };

  // For Speed Converter
  const calculateSpeedConversion = () => {
    if (!speedValue) {
      toast({ title: "Please enter a value to convert" });
      return;
    }
    
    const value = parseFloat(speedValue);
    if (isNaN(value) || value < 0) {
      toast({ title: "Please enter a valid value" });
      return;
    }
    
    // Convert to meters per second first
    const conversionFactors: Record<string, number> = {
      "ms": 1, // meter per second
      "kmh": 0.277778, // kilometer per hour
      "mph": 0.44704, // miles per hour
      "knot": 0.514444, // nautical mile per hour
      "fts": 0.3048 // feet per second
    };
    
    const msValue = value * conversionFactors[speedFromUnit];
    const result = msValue / conversionFactors[speedToUnit];
    
    setSpeedResult(result.toFixed(4));
  };

  // For Next Birthday Calculator
  const calculateNextBirthday = () => {
    if (!birthdate) {
      toast({ title: "Please enter your birthdate" });
      return;
    }
    
    const today = new Date();
    const bdate = new Date(birthdate);
    
    if (isNaN(bdate.getTime())) {
      toast({ title: "Please enter a valid date" });
      return;
    }
    
    const age = today.getFullYear() - bdate.getFullYear();
    
    // Next birthday this year or next year
    const nextBirthday = new Date(
      today.getFullYear() + (today.getMonth() > bdate.getMonth() || 
      (today.getMonth() === bdate.getMonth() && today.getDate() >= bdate.getDate()) ? 1 : 0),
      bdate.getMonth(),
      bdate.getDate()
    );
    
    // Days until next birthday
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const daysUntil = Math.round(Math.abs((nextBirthday.getTime() - today.getTime()) / oneDay));
    
    setNextBirthdayResult({
      days: daysUntil,
      date: nextBirthday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      age: age + (today.getMonth() > bdate.getMonth() || 
             (today.getMonth() === bdate.getMonth() && today.getDate() >= bdate.getDate()) ? 1 : 0)
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background transition-all duration-500">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary/20 border-b-primary/20 border-l-primary/20 animate-rotate-center"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calculator className="w-10 h-10 text-primary animate-pulse-light" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-foreground animate-pulse-light">
          SKYIOUS Calculator
        </h1>
      </div>
    );
  }

  const renderStandardCalculator = () => (
    <div className="space-y-4">
      <div className="calculator-display h-24 flex flex-col items-end justify-center">
        <div className="text-sm text-foreground/60">
          {previousValue !== null ? `${previousValue} ${operation}` : ''}
        </div>
        <div className="text-3xl sm:text-4xl font-semibold transition-all duration-200 animate-slide-in-up">
          {display}
        </div>
      </div>
      
      <div className="calculator-grid h-[min(65vh,500px)]">
        <button onClick={handleClearClick} className="calculator-key key-function">C</button>
        <button onClick={handleDeleteClick} className="calculator-key key-function">
          <X size={18} />
        </button>
        <button onClick={handlePercentClick} className="calculator-key key-function">
          <Percent size={18} />
        </button>
        <button onClick={() => handleOperationClick("/")} className="calculator-key key-operation">
          <Divide size={18} />
        </button>
        
        <button onClick={() => handleNumberClick("7")} className="calculator-key key-number">7</button>
        <button onClick={() => handleNumberClick("8")} className="calculator-key key-number">8</button>
        <button onClick={() => handleNumberClick("9")} className="calculator-key key-number">9</button>
        <button onClick={() => handleOperationClick("*")} className="calculator-key key-operation">×</button>
        
        <button onClick={() => handleNumberClick("4")} className="calculator-key key-number">4</button>
        <button onClick={() => handleNumberClick("5")} className="calculator-key key-number">5</button>
        <button onClick={() => handleNumberClick("6")} className="calculator-key key-number">6</button>
        <button onClick={() => handleOperationClick("-")} className="calculator-key key-operation">
          <Minus size={18} />
        </button>
        
        <button onClick={() => handleNumberClick("1")} className="calculator-key key-number">1</button>
        <button onClick={() => handleNumberClick("2")} className="calculator-key key-number">2</button>
        <button onClick={() => handleNumberClick("3")} className="calculator-key key-number">3</button>
        <button onClick={() => handleOperationClick("+")} className="calculator-key key-operation">
          <Plus size={18} />
        </button>
        
        <button onClick={() => handleNumberClick("0")} className="calculator-key key-number col-span-2">0</button>
        <button onClick={handleDecimalClick} className="calculator-key key-number">.</button>
        <button onClick={handleEqualsClick} className="calculator-key key-equals">
          <Equal size={18} />
        </button>
      </div>
    </div>
  );

  const renderBMICalculator = () => (
    <div className="special-calculator-container space-y-4 animate-slide-in-up">
      <div className="space-y-3">
        <label className="block text-sm font-medium">Height (cm)</label>
        <input
          type="number"
          className="input-field"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height in centimeters"
        />
        
        <label className="block text-sm font-medium">Weight (kg)</label>
        <input
          type="number"
          className="input-field"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight in kilograms"
        />
        
        <button 
          onClick={calculateBMI} 
          className="w-full mt-2 bg-primary text-primary-foreground rounded-lg py-2 transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Calculate BMI
        </button>
      </div>
      
      {bmiResult !== null && (
        <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 animate-scale">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/70">Your BMI</div>
            <div className="text-3xl font-bold">{bmiResult}</div>
            <div className={cn(
              "text-sm font-medium py-1 px-3 rounded-full inline-block mt-2",
              bmiCategory === "Underweight" && "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300",
              bmiCategory === "Normal weight" && "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
              bmiCategory === "Overweight" && "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
              bmiCategory === "Obese" && "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
            )}>
              {bmiCategory}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDataConverter = () => (
    <div className="special-calculator-container space-y-4 animate-slide-in-up">
      <div className="space-y-3">
        <label className="block text-sm font-medium">Value</label>
        <input
          type="number"
          className="input-field"
          value={dataValue}
          onChange={(e) => setDataValue(e.target.value)}
          placeholder="Enter value to convert"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">From</label>
            <select
              className="input-field mt-1"
              value={dataFromUnit}
              onChange={(e) => setDataFromUnit(e.target.value)}
            >
              <option value="bit">Bit</option>
              <option value="byte">Byte</option>
              <option value="kilobyte">Kilobyte (KB)</option>
              <option value="megabyte">Megabyte (MB)</option>
              <option value="gigabyte">Gigabyte (GB)</option>
              <option value="terabyte">Terabyte (TB)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium">To</label>
            <select
              className="input-field mt-1"
              value={dataToUnit}
              onChange={(e) => setDataToUnit(e.target.value)}
            >
              <option value="bit">Bit</option>
              <option value="byte">Byte</option>
              <option value="kilobyte">Kilobyte (KB)</option>
              <option value="megabyte">Megabyte (MB)</option>
              <option value="gigabyte">Gigabyte (GB)</option>
              <option value="terabyte">Terabyte (TB)</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={calculateDataConversion} 
          className="w-full mt-2 bg-primary text-primary-foreground rounded-lg py-2 transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Convert
        </button>
      </div>
      
      {dataResult && (
        <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 animate-scale">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/70">Result</div>
            <div className="text-xl font-bold break-all">{dataResult}</div>
            <div className="text-sm mt-1">
              {dataValue} {dataFromUnit} = {dataResult} {dataToUnit}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVolumeConverter = () => (
    <div className="special-calculator-container space-y-4 animate-slide-in-up">
      <div className="space-y-3">
        <label className="block text-sm font-medium">Value</label>
        <input
          type="number"
          className="input-field"
          value={volumeValue}
          onChange={(e) => setVolumeValue(e.target.value)}
          placeholder="Enter value to convert"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">From</label>
            <select
              className="input-field mt-1"
              value={volumeFromUnit}
              onChange={(e) => setVolumeFromUnit(e.target.value)}
            >
              <option value="milliliter">Milliliter (ml)</option>
              <option value="liter">Liter (L)</option>
              <option value="cup">Cup</option>
              <option value="pint">Pint</option>
              <option value="gallon">Gallon</option>
              <option value="cubic-meter">Cubic Meter (m³)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium">To</label>
            <select
              className="input-field mt-1"
              value={volumeToUnit}
              onChange={(e) => setVolumeToUnit(e.target.value)}
            >
              <option value="milliliter">Milliliter (ml)</option>
              <option value="liter">Liter (L)</option>
              <option value="cup">Cup</option>
              <option value="pint">Pint</option>
              <option value="gallon">Gallon</option>
              <option value="cubic-meter">Cubic Meter (m³)</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={calculateVolumeConversion} 
          className="w-full mt-2 bg-primary text-primary-foreground rounded-lg py-2 transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Convert
        </button>
      </div>
      
      {volumeResult && (
        <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 animate-scale">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/70">Result</div>
            <div className="text-xl font-bold break-all">{volumeResult}</div>
            <div className="text-sm mt-1">
              {volumeValue} {volumeFromUnit} = {volumeResult} {volumeToUnit}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGSTCalculator = () => (
    <div className="special-calculator-container space-y-4 animate-slide-in-up">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGstType("exclusive")}
            className={cn(
              "text-sm py-2 rounded-lg transition-all duration-200",
              gstType === "exclusive" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/70 dark:bg-secondary/30 hover:bg-secondary/90 dark:hover:bg-secondary/40"
            )}
          >
            Add GST (Exclusive)
          </button>
          <button
            onClick={() => setGstType("inclusive")}
            className={cn(
              "text-sm py-2 rounded-lg transition-all duration-200",
              gstType === "inclusive" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/70 dark:bg-secondary/30 hover:bg-secondary/90 dark:hover:bg-secondary/40"
            )}
          >
            Extract GST (Inclusive)
          </button>
        </div>
        
        <label className="block text-sm font-medium">
          {gstType === "exclusive" ? "Base Amount" : "Total Amount with GST"}
        </label>
        <input
          type="number"
          className="input-field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={gstType === "exclusive" ? "Enter amount before GST" : "Enter amount including GST"}
        />
        
        <label className="block text-sm font-medium">GST Rate (%)</label>
        <select
          className="input-field"
          value={gstRate}
          onChange={(e) => setGstRate(e.target.value)}
        >
          <option value="5">5%</option>
          <option value="12">12%</option>
          <option value="18">18%</option>
          <option value="28">28%</option>
          <option value="custom">Custom</option>
        </select>
        
        {gstRate === "custom" && (
          <input
            type="number"
            className="input-field mt-2"
            value={gstRate === "custom" ? "" : gstRate}
            onChange={(e) => setGstRate(e.target.value)}
            placeholder="Enter custom GST rate"
          />
        )}
        
        <button 
          onClick={calculateGST} 
          className="w-full mt-2 bg-primary text-primary-foreground rounded-lg py-2 transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Calculate
        </button>
      </div>
      
      {gstResult.baseAmount && (
        <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 animate-scale">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-sm font-medium text-foreground/70">Base Amount</div>
              <div className="text-lg font-bold">{gstResult.baseAmount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground/70">GST Amount</div>
              <div className="text-lg font-bold">{gstResult.gstAmount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground/70">Total</div>
              <div className="text-lg font-bold">{gstResult.totalAmount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSpeedConverter = () => (
    <div className="special-calculator-container space-y-4 animate-slide-in-up">
      <div className="space-y-3">
        <label className="block text-sm font-medium">Value</label>
        <input
          type="number"
          className="input-field"
          value={speedValue}
          onChange={(e) => setSpeedValue(e.target.value)}
          placeholder="Enter value to convert"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">From</label>
            <select
              className="input-field mt-1"
              value={speedFromUnit}
              onChange={(e) => setSpeedFromUnit(e.target.value)}
            >
              <option value="ms">Meters per second (m/s)</option>
              <option value="kmh">Kilometers per hour (km/h)</option>
              <option value="mph">Miles per hour (mph)</option>
              <option value="knot">Knots</option>
              <option value="fts">Feet per second (ft/s)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium">To</label>
            <select
              className="input-field mt-1"
              value={speedToUnit}
              onChange={(e) => setSpeedToUnit(e.target.value)}
            >
              <option value="ms">Meters per second (m/s)</option>
              <option value="kmh">Kilometers per hour (km/h)</option>
              <option value="mph">Miles per hour (mph)</option>
              <option value="knot">Knots</option>
              <option value="fts">Feet per second (ft/s)</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={calculateSpeedConversion} 
          className="w-full mt-2 bg-primary text-primary-foreground rounded-lg py-2 transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Convert
        </button>
      </div>
      
      {speedResult && (
        <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 animate-scale">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/70">Result</div>
            <div className="text-xl font-bold">{speedResult}</div>
            <div className="text-sm mt-1">
              {speedValue} {speedFromUnit} = {speedResult} {speedToUnit}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderNextBirthdayCalculator = () => (
    <div className="special-calculator-container space-y-4 animate-slide-in-up">
      <div className="space-y-3">
        <label className="block text-sm font-medium">Your Birthdate</label>
        <input
          type="date"
          className="input-field"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
        
        <button 
          onClick={calculateNextBirthday} 
          className="w-full mt-2 bg-primary text-primary-foreground rounded-lg py-2 transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Calculate
        </button>
      </div>
      
      {nextBirthdayResult.days > 0 && (
        <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/30 animate-scale">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">{nextBirthdayResult.days}</div>
            <div className="text-sm font-medium text-foreground/70">
              days until your next birthday
            </div>
            <div className="mt-2 text-sm">
              <div>Next Birthday: {nextBirthdayResult.date}</div>
              <div>You will be {nextBirthdayResult.age} years old</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <div className="calculator-container max-w-lg w-full mb-4 relative animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">SKYIOUS Calculator</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme("light")}
              className={cn("theme-toggle-button", theme === "light" && "ring-2 ring-primary")}
              aria-label="Light mode"
            >
              <Sun size={18} />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn("theme-toggle-button", theme === "dark" && "ring-2 ring-primary")}
              aria-label="Dark mode"
            >
              <Moon size={18} />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn("theme-toggle-button", theme === "system" && "ring-2 ring-primary")}
              aria-label="System theme"
            >
              <Computer size={18} />
            </button>
          </div>
        </div>
                
        <Tabs defaultValue="standard" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-7 mb-4">
            <TabsTrigger value="standard" className="tab-button">
              <Calculator size={16} className="hidden sm:block" />
              <span className="sm:hidden">Calc</span>
            </TabsTrigger>
            <TabsTrigger value="bmi" className="tab-button">
              <Weight size={16} className="hidden sm:block" />
              <span className="sm:hidden">BMI</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="tab-button">
              <Database size={16} className="hidden sm:block" />
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger value="volume" className="tab-button">
              <Volume2 size={16} className="hidden sm:block" />
              <span className="sm:hidden">Vol</span>
            </TabsTrigger>
            <TabsTrigger value="gst" className="tab-button">
              <IndianRupee size={16} className="hidden sm:block" />
              <span className="sm:hidden">GST</span>
            </TabsTrigger>
            <TabsTrigger value="speed" className="tab-button">
              <Gauge size={16} className="hidden sm:block" />
              <span className="sm:hidden">Speed</span>
            </TabsTrigger>
            <TabsTrigger value="birthday" className="tab-button">
              <Calendar size={16} className="hidden sm:block" />
              <span className="sm:hidden">Birth</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="mt-0">
            {renderStandardCalculator()}
          </TabsContent>
          
          <TabsContent value="bmi" className="mt-0">
            {renderBMICalculator()}
          </TabsContent>
          
          <TabsContent value="data" className="mt-0">
            {renderDataConverter()}
          </TabsContent>
          
          <TabsContent value="volume" className="mt-0">
            {renderVolumeConverter()}
          </TabsContent>
          
          <TabsContent value="gst" className="mt-0">
            {renderGSTCalculator()}
          </TabsContent>
          
          <TabsContent value="speed" className="mt-0">
            {renderSpeedConverter()}
          </TabsContent>
          
          <TabsContent value="birthday" className="mt-0">
            {renderNextBirthdayCalculator()}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-sm text-foreground/60 mt-2 animate-fade-in">
        © 2023 SKYIOUS • All rights reserved
      </div>
    </div>
  );
};

export default SKYIOUS_CALCULATOR;
