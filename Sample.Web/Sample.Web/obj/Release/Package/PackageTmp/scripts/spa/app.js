//Module - Dravya Admin Home
(function (app) {
    'use strict';

    app.config(config);
    app.run(run);

    //Routing functionalities
    config.$inject = ['$routeProvider', '$logProvider'];
    function config($routeProvider, $logProvider) {
        $logProvider.debugEnabled(false);
        $routeProvider
            .when("/", {
                templateUrl: "scripts/spa/AssetAdmin/dashboard/dashboard.html",
                controller: "asset.admin.dashboard.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
             .when("/login", {
                 templateUrl: "scripts/spa/AssetAdmin/login/login.html",
                 controller: "loginCtrl",
             })
             .when("/about", {
                 templateUrl: "scripts/spa/AssetAdmin/about/about.html",
                 controller: "asset.admin.dashboard.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })
             .when("/ingredients", {
                 templateUrl: "scripts/spa/AssetAdmin/ingredients/IngredientList.html",
                 controller: "asset.admin.ingredient.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })
              .when("/ingredients/new", {
                  templateUrl: "scripts/spa/AssetAdmin/ingredients/IngredientHeader.html",
                  controller: "asset.admin.ingredient.ctrl",
                  resolve: { isAuthenticated: isAuthenticated }
              })
             .when("/ingredients/detail/:id", {
                 templateUrl: "scripts/spa/AssetAdmin/ingredients/IngredientDetail.html",
                 controller: "asset.admin.ingredient.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })
            .when("/users", {
                templateUrl: "scripts/spa/AssetAdmin/users/UsersList.html",
                controller: "asset.admin.users.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
             .when("/users/new", {
                 templateUrl: "scripts/spa/AssetAdmin/users/UserRegister.html",
                 controller: "asset.admin.users.register.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })
            .when("/users/edit/:id", {
                templateUrl: "scripts/spa/AssetAdmin/users/UserRegister.html",
                controller: "asset.admin.users.register.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
            .when("/transactions/assettransfer", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/AssetTransfer.html",
                controller: "asset.transactions.assettransfer.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
            .when("/transactions/assettest", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/AssetTest.html",
                controller: "assetTestControl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/departments", {
                templateUrl: "scripts/spa/AssetAdmin/department/departmentList.html",
                controller: "asset.admin.department.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/locations", {
                templateUrl: "scripts/spa/AssetAdmin/locations/locations.html",
                controller: "asset.admin.locations.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/assettypes", {
                templateUrl: "scripts/spa/AssetAdmin/assettypes/AssetTypeList.html",
                controller: "asset.admin.assettype.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

             .when("/assettypes/new", {
                 templateUrl: "scripts/spa/AssetAdmin/assettypes/AssetType.html",
                 controller: "asset.admin.assettype.new.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })

             .when("/assettypes/edit/:id", {
                 templateUrl: "scripts/spa/AssetAdmin/assettypes/AssetType.html",
                 controller: "asset.admin.assettype.new.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })

            .when("/employees", {
                templateUrl: "scripts/spa/AssetAdmin/employees/EmployeeList.html",
                controller: "asset.admin.employees.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/employees/new", {
                templateUrl: "scripts/spa/AssetAdmin/employees/EmployeeRegister.html",
                controller: "asset.admin.employees.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/employees/edit/:id", {
                templateUrl: "scripts/spa/AssetAdmin/employees/EmployeeRegister.html",
                controller: "asset.admin.employees.ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/ownerships", {
                templateUrl: "scripts/spa/AssetAdmin/ownership/ownership.html",
                controller: "asset.admin.ownership.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/suppliers", {
                templateUrl: "scripts/spa/AssetAdmin/supplier/supplierList.html",
                controller: "asset.admin.suppliers.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })


            .when("/suppliers/edit/:id", {
                templateUrl: "scripts/spa/AssetAdmin/supplier/Supplier.html",
                controller: "asset.admin.suppliers.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/suppliers/new", {
                templateUrl: "scripts/spa/AssetAdmin/supplier/Supplier.html",
                controller: "asset.admin.suppliers.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/customerLocations", {
                templateUrl: "scripts/spa/AssetAdmin/customerLocations/customerLocationsList.html",
                controller: "asset.admin.customer.location.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

             .when("/customers", {
                 templateUrl: "scripts/spa/AssetAdmin/customer/customerList.html",
                 controller: "asset.admin.customers.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })

            .when("/customers/new", {
                templateUrl: "scripts/spa/AssetAdmin/customer/Customer.html",
                controller: "asset.admin.customers.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/customers/edit/:id", {
                templateUrl: "scripts/spa/AssetAdmin/customer/Customer.html",
                controller: "asset.admin.customers.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })


            .when("/assetRegister", {
                templateUrl: "scripts/spa/AssetAdmin/assetRegister/assetRegisterList.html",
                controller: "asset.admin.assetRegister.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })


            .when("/assetRegister/edit/:id", {
                templateUrl: "scripts/spa/AssetAdmin/assetRegister/assetRegister.html",
                controller: "asset.admin.assetRegister.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/assetRegister/new", {
                templateUrl: "scripts/spa/AssetAdmin/assetRegister/assetRegister.html",
                controller: "asset.admin.assetRegister.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/demo", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/assettest.html",
                controller: "assetTestControl",
                resolve: { isAuthenticated: isAuthenticated }
            })

            .when("/transactions/purchaseOrder", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/purchaseOrder/purchaseOrder.html",
                controller: "purchaseOrderCtrl",
                resolve: {isAuthenticated: isAuthenticated}

            })

            .when("/transactions/purchase", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/purchase/purchase.html",
                controller: "asset.transactions.purchase.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/tree", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/purchase/treeView.html",
                controller: "treeViewCtrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/transactions/assetTransfer", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/AssetTransfer/assetTransfer.html",
                controller: "asset.transactions.assetTransfer.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/transactions/purchaseReturn", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/purchaseReturn/purchaseReturn.html",
                controller: "asset.transactions.purchaseReturn.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/transactions/writeOff", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/writeOff/writeOff.html",
                controller: "asset.transactions.writeOff.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })


            .when("/transactions/consumption", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/expenses/consumption.html",
                controller: "asset.transactions.consumption.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/transactions/maintenance", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/expenses/maintenance.html",
                controller: "asset.transactions.maintenance.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })


            .when("/transactions/otherExpenses", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/expenses/otherExpenses.html",
                controller: "asset.transactions.otherExpense.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })


            .when("/transactions/renewal", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/expenses/Renewal.html",
                controller: "asset.transactions.renewal.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })



            .when("/transactions/sales", {
                templateUrl: "scripts/spa/AssetAdmin/transactions/sales/sales.html",
                controller: "asset.transactions.sales.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })


            .when("/menu", {
                templateUrl: "scripts/spa/AssetAdmin/menu/menuList.html",
                controller: "asset.admin.menu.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })

            //Reports

             .when("/reports/assetDetails", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetDetails.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/assetList", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetList.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/assetInventorySummary", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetInventorySummary.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/assetInventoryDetailed", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetInventoryDetailed.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

            .when("/reports/assetInventoryDeptWise", {
                templateUrl: "scripts/spa/AssetAdmin/reports/assetInventoryDeptWise.html",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .when("/reports/assetEnquiry", {
                templateUrl: "scripts/spa/AssetAdmin/reports/assetEnquiry/enquiry.html",
                controller: "asset.admin.assetEnquiry.ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })


            .when("/reports/assetTransferEnquiry", {
                templateUrl: "scripts/spa/AssetAdmin/reports/AssetEnquiry/assetTransfer.html",
                controller: "asset.transactions.assetTransferEnquiry.Ctrl",
                resolve: { isAuthenticated: isAuthenticated }

            })




            .when("/reports/assetMovementReport", {
                templateUrl: "scripts/spa/AssetAdmin/reports/assetMovementReport.html",
                resolve: { isAuthenticated: isAuthenticated }

            })

             .when("/reports/assetPOSummary", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetPOSummary.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/assetPODetailed", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetPODetailed.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })


             .when("/reports/assetPurchaseRegister", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetPurchaseRegister.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/assetPurchaseReturnRegister", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetPurchaseReturnRegister.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

            .when("/reports/assetWriteOffRegister", {
                templateUrl: "scripts/spa/AssetAdmin/reports/assetWriteOffRegister.html",
                resolve: { isAuthenticated: isAuthenticated }

            })

             .when("/reports/assetSalesRegister", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/assetSalesRegister.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/documentExpiry", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/documentExpiry.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/documentRenewal", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/documentRenewal.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/consumptionSummary", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/consumptionSummary.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

             .when("/reports/consumptionDetailed", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/consumptionDetailed.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

            .when("/reports/RepairSummary", {
                templateUrl: "scripts/spa/AssetAdmin/reports/repairSummary.html",
                resolve: { isAuthenticated: isAuthenticated }

            })

             .when("/reports/RepairDetailed", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/repairDetailed.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

            .when("/reports/otherExpensesSummary", {
                templateUrl: "scripts/spa/AssetAdmin/reports/otherExpensesSummary.html",
                resolve: { isAuthenticated: isAuthenticated }

            })

             .when("/reports/otherExpensesDetailed", {
                 templateUrl: "scripts/spa/AssetAdmin/reports/otherExpensesDetailed.html",
                 resolve: { isAuthenticated: isAuthenticated }

             })

            .when("/reports/vehicleDetails", {
                templateUrl: "scripts/spa/AssetAdmin/reports/vehicleDetails.html",
                resolve: { isAuthenticated: isAuthenticated }

            })

            .otherwise({ redirectTo: "/" });

    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

    //Checks repository
    function run($rootScope, $location, $cookieStore, $http) {
        $rootScope.repository = $cookieStore.get('repository') || { loggedUser: "" };
        if ($rootScope.repository.loggedUser == "") {
            $rootScope.islogged = false;
            $location.path("/login");
        }
        if ($rootScope.repository.loggedUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.repository.loggedUser.authdata;
        }
    }

    //Checks whether the authentication informations exists in the localstorage
    //If the information exists then allow else redirect to the login
    isAuthenticated.$inject = ['membershipService', '$rootScope', '$location'];
    function isAuthenticated(membershipService, $rootScope, $location) {
        if (!membershipService.isUserLoggedIn()) {
            $rootScope.previousState = $location.path();
            $rootScope.islogged = false;
            $location.path("/login");
        }
        else {
            $rootScope.islogged = true;
        }
    }
    //apiServiceBaseUri: 'http://localhost:1947'
    //apiServiceBaseUri: 'http://afisg001.cloudapp.net:84/'

    app.constant('constants', {
        pageSize: 10,
        dateFormat: 'dd-MM-yyyy',
        apiServiceBaseUri: 'http://localhost:1947',
        defaultDsId: 'BT',
        defaultDeptName: 'BEAUTY THERAPY',
        defaultLocCd: 'SA',
        defaultLocName: 'EMIRATES MEDICAL CENTER-SALALA'
    });

})(angular.module('AssetAdminApp', ['common.core', 'common.ui','ui-notification', 'easyComplete', 'controlDirectives', 'angularTreeview','ngSanitize']));
